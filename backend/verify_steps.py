"""Verification harness for Campus Connect build steps.

Uses an in-memory FakeSupabase that mimics the small slice of the
`supabase` Python client used by our routers (table/select/insert/
update + eq filter + execute). Each step section patches the routers'
`get_supabase` symbol and drives the API with FastAPI's TestClient.

Run from backend/:  python verify_steps.py [step2|step3|step4|all]
"""
import sys
import uuid
from datetime import datetime, timezone


def _now_iso():
    return datetime.now(timezone.utc).isoformat()


class FakeResult:
    def __init__(self, data):
        self.data = data


class FakeQuery:
    """Chainable fake: table(...).select/insert/update(...).eq(...).execute()."""

    def __init__(self, store, table_name):
        self._rows = store.setdefault(table_name, [])
        self._filters = []
        self._op = ("select", None)

    # -- builders (all return self for chaining) --
    def select(self, *args, **kwargs):
        self._op = ("select", None)
        return self

    def insert(self, payload):
        self._op = ("insert", payload)
        return self

    def update(self, payload):
        self._op = ("update", payload)
        return self

    def eq(self, col, val):
        self._filters.append((col, str(val)))
        return self

    # -- execution --
    def _filtered(self):
        out = self._rows
        for col, val in self._filters:
            out = [r for r in out if str(r.get(col)) == val]
        return out

    def execute(self):
        kind, payload = self._op
        if kind == "select":
            return FakeResult([dict(r) for r in self._filtered()])
        if kind == "insert":
            rows = payload if isinstance(payload, list) else [payload]
            saved = []
            for row in rows:
                new = dict(row)
                new.setdefault("id", str(uuid.uuid4()))
                for ts_key in ("created_at", "registered_at", "checked_in_at",
                               "issued_at", "updated_at"):
                    new.setdefault(ts_key, _now_iso())
                self._rows.append(new)
                saved.append(dict(new))
            return FakeResult(saved)
        if kind == "update":
            updated = []
            for r in self._filtered():
                r.update(payload)
                r["updated_at"] = _now_iso()
                updated.append(dict(r))
            return FakeResult(updated)
        raise AssertionError(f"unknown op {kind}")


class FakeSupabase:
    def __init__(self):
        self.store = {}

    def table(self, name):
        return FakeQuery(self.store, name)


def make_client_with_fake(fake):
    """Build a TestClient with every router pointed at the fake DB."""
    from fastapi.testclient import TestClient

    import routers.approvals as approvals_mod
    import routers.attendance as attendance_mod
    import routers.certificates as certificates_mod
    import routers.events as events_mod
    import routers.reports as reports_mod
    from main import app

    for mod in (approvals_mod, attendance_mod, certificates_mod,
                events_mod, reports_mod):
        if hasattr(mod, "get_supabase"):
            mod.get_supabase = lambda: fake
    return TestClient(app)


def check(cond, label):
    print(("  PASS " if cond else "  FAIL ") + label)
    if not cond:
        raise SystemExit(f"FAILED: {label}")


def run_step2():
    print("== Step 2: Events CRUD + auto approval rows ==")
    fake = FakeSupabase()
    c = make_client_with_fake(fake)

    body = {
        "title": "HackNight 2026",
        "description": "Overnight hackathon",
        "club": "Coding Club",
        "organizer_id": str(uuid.uuid4()),
        "venue_id": str(uuid.uuid4()),
        "start_time": "2026-10-20T10:00:00+00:00",
        "end_time": "2026-10-20T18:00:00+00:00",
        "target_dept": "CSE",
        "target_year": 2,
    }
    r = c.post("/events", json=body)
    check(r.status_code == 201, f"POST /events -> 201 (got {r.status_code})")
    event = r.json()
    check(event["status"] == "pending", "new event status is pending")
    check("id" in event, "new event has id")

    approvals = fake.store.get("approvals", [])
    check(len(approvals) == 3, f"3 approval rows created (got {len(approvals)})")
    chain = sorted((a["approver_role"], a["step_order"]) for a in approvals)
    check(chain == [("dean", 3), ("faculty", 1), ("hod", 2)],
          f"approval chain faculty1/hod2/dean3 (got {chain})")
    check(all(a["event_id"] == event["id"] for a in approvals),
          "approval rows reference the new event")

    r = c.get("/events", params={"status": "approved"})
    check(r.status_code == 200 and r.json() == [], "GET /events?status=approved -> []")
    r = c.get("/events")
    check(r.status_code == 200 and len(r.json()) == 1, "GET /events -> 1 event")

    r = c.get(f"/events/{event['id']}")
    check(r.status_code == 200 and r.json()["title"] == "HackNight 2026",
          "GET /events/{id} -> the event")
    r = c.get(f"/events/{uuid.uuid4()}")
    check(r.status_code == 404, f"GET /events/unknown -> 404 (got {r.status_code})")

    bad = dict(body, end_time="2026-10-20T09:00:00+00:00")
    r = c.post("/events", json=bad)
    check(r.status_code == 422, f"end_time<=start_time -> 422 (got {r.status_code})")
    bad2 = dict(body)
    del bad2["title"]
    r = c.post("/events", json=bad2)
    check(r.status_code == 422, f"missing title -> 422 (got {r.status_code})")
    r = c.get("/events", params={"status": "bogus"})
    check(r.status_code == 400, f"bad status filter -> 400 (got {r.status_code})")
    print("Step 2 OK\n")


def _create_event(client, title="HackNight 2026"):
    body = {
        "title": title,
        "description": "Overnight hackathon",
        "club": "Coding Club",
        "organizer_id": str(uuid.uuid4()),
        "venue_id": str(uuid.uuid4()),
        "start_time": "2026-10-20T10:00:00+00:00",
        "end_time": "2026-10-20T18:00:00+00:00",
        "target_dept": "CSE",
        "target_year": 2,
    }
    r = client.post("/events", json=body)
    assert r.status_code == 201, r.text
    return r.json()


def run_step3():
    print("== Step 3: Approval workflow with step-order enforcement ==")
    fake = FakeSupabase()
    c = make_client_with_fake(fake)
    event = _create_event(c)

    def pending(role):
        r = c.get("/approvals/pending", params={"role": role})
        assert r.status_code == 200, r.text
        return r.json()

    # Only faculty sees something at first (step-order gating).
    check(len(pending("faculty")) == 1, "faculty sees 1 actionable item")
    check(pending("hod") == [], "hod sees nothing before faculty approves")
    check(pending("dean") == [], "dean sees nothing before faculty approves")

    # Out-of-order decision is blocked.
    hod_item = [a for a in fake.store["approvals"]
                if a["approver_role"] == "hod"][0]
    r = c.post(f"/approvals/{hod_item['id']}/decide",
               json={"decision": "approved"})
    check(r.status_code == 409, f"hod deciding early -> 409 (got {r.status_code})")

    # Faculty approves -> hod becomes actionable, event still pending.
    fac = pending("faculty")[0]
    r = c.post(f"/approvals/{fac['id']}/decide",
               json={"decision": "approved", "comment": "looks good"})
    check(r.status_code == 200 and r.json()["status"] == "approved",
          "faculty approval recorded")
    check(len(pending("hod")) == 1, "hod sees 1 item after faculty approval")
    r = c.get(f"/events/{event['id']}")
    check(r.json()["status"] == "pending", "event still pending mid-chain")

    # Double decision on the same step is blocked.
    r = c.post(f"/approvals/{fac['id']}/decide", json={"decision": "approved"})
    check(r.status_code == 409, f"re-deciding same step -> 409 (got {r.status_code})")

    # Hod approves -> dean actionable; dean approves -> event approved.
    hod = pending("hod")[0]
    c.post(f"/approvals/{hod['id']}/decide", json={"decision": "approved"})
    check(len(pending("dean")) == 1, "dean sees 1 item after hod approval")
    dean = pending("dean")[0]
    c.post(f"/approvals/{dean['id']}/decide", json={"decision": "approved"})
    r = c.get(f"/events/{event['id']}")
    check(r.json()["status"] == "approved", "event approved after dean step")
    check(pending("dean") == [], "no pending items left after full approval")

    # Rejection path: faculty rejects second event -> event rejected, chain stops.
    event2 = _create_event(c, title="RoboWars")
    fac2 = c.get("/approvals/pending", params={"role": "faculty"}).json()[0]
    # (faculty queue now holds only event2's item)
    check(fac2["event_id"] == event2["id"], "faculty queue shows second event")
    r = c.post(f"/approvals/{fac2['id']}/decide",
               json={"decision": "rejected", "comment": "no budget"})
    check(r.status_code == 200 and r.json()["status"] == "rejected",
          "faculty rejection recorded")
    r = c.get(f"/events/{event2['id']}")
    check(r.json()["status"] == "rejected", "event rejected after any rejection")
    hod2 = [a for a in fake.store["approvals"]
            if a["event_id"] == event2["id"] and a["approver_role"] == "hod"][0]
    r = c.post(f"/approvals/{hod2['id']}/decide", json={"decision": "approved"})
    check(r.status_code == 409, f"deciding on rejected event -> 409 (got {r.status_code})")

    # Bad inputs.
    r = c.get("/approvals/pending", params={"role": "principal"})
    check(r.status_code == 400, f"unknown role -> 400 (got {r.status_code})")
    r = c.get("/approvals/pending")
    check(r.status_code == 400, f"missing role -> 400 (got {r.status_code})")
    r = c.post(f"/approvals/{uuid.uuid4()}/decide",
               json={"decision": "approved"})
    check(r.status_code == 404, f"unknown approval id -> 404 (got {r.status_code})")
    print("Step 3 OK\n")


def run_step4():
    print("== Step 4: Clash detection + slot suggestions ==")
    fake = FakeSupabase()
    c = make_client_with_fake(fake)
    # Monday 2026-10-19 (weekday 0). Timetable: CSE/2 has 09:00-10:00 class.
    fake.store["timetable"] = [
        {"department": "CSE", "year": 2, "weekday": 0,
         "start_time": "09:00:00", "end_time": "10:00:00"},
        {"department": "CSE", "year": 2, "weekday": 0,
         "start_time": "14:00:00", "end_time": "16:00:00"},
    ]
    venue_a, venue_b = str(uuid.uuid4()), str(uuid.uuid4())

    def mk(title, venue, start, end, dept="CSE", year=2):
        body = {"title": title, "organizer_id": str(uuid.uuid4()),
                "venue_id": venue, "start_time": start, "end_time": end,
                "target_dept": dept, "target_year": year}
        r = c.post("/events", json=body)
        assert r.status_code == 201, r.text
        return r.json()

    # Existing: venue A, Monday 10:00-12:00, audience CSE/2.
    mk("Existing", venue_a, "2026-10-19T10:00:00+00:00",
       "2026-10-19T12:00:00+00:00")

    def clash(venue, start, end, dept="CSE", year=2):
        r = c.post("/events/check-clash",
                   json={"venue_id": venue, "start_time": start,
                         "end_time": end, "target_dept": dept,
                         "target_year": year})
        assert r.status_code == 200, r.text
        return r.json()

    # 1. Venue clash on overlap; boundary touch (12:00 start) is NOT a clash.
    res = clash(venue_a, "2026-10-19T11:00:00+00:00",
                "2026-10-19T13:00:00+00:00")
    check(len(res["venue_clashes"]) == 1
          and res["venue_clashes"][0]["title"] == "Existing",
          "overlapping same-venue event detected")
    res = clash(venue_a, "2026-10-19T12:00:00+00:00",
                "2026-10-19T13:00:00+00:00", dept="ECE", year=3)
    check(res["venue_clashes"] == [], "boundary touch is not a clash")

    # 2. Audience clash needs same dept+year; other venue to isolate it.
    res = clash(venue_b, "2026-10-19T11:00:00+00:00",
                "2026-10-19T13:00:00+00:00")
    check(res["venue_clashes"] == []
          and len(res["audience_clashes"]) == 1,
          "same dept+year overlap flagged as audience clash")
    res = clash(venue_b, "2026-10-19T11:00:00+00:00",
                "2026-10-19T13:00:00+00:00", dept="ECE", year=3)
    check(res["audience_clashes"] == [], "different dept+year -> no audience clash")

    # 3. Class clash: Monday 09:30-10:30 hits the 09:00-10:00 row.
    res = clash(venue_b, "2026-10-19T09:30:00+00:00",
                "2026-10-19T10:30:00+00:00", dept="ME", year=1)
    check(res["class_clashes"] == [], "timetable of other dept/year ignored")
    res = clash(venue_b, "2026-10-19T09:30:00+00:00",
                "2026-10-19T10:30:00+00:00")
    check(len(res["class_clashes"]) == 1
          and res["class_clashes"][0]["start_time"] == "09:00:00",
          "class clash against Monday 09:00-10:00 row")
    res = clash(venue_b, "2026-10-19T16:00:00+00:00",
                "2026-10-19T17:00:00+00:00")
    check(res["class_clashes"] == [], "16:00 slot clear of classes")

    # 4. Rejected events are ignored by venue + audience checks.
    for e in fake.store["events"]:
        e["status"] = "rejected"
    res = clash(venue_a, "2026-10-19T11:00:00+00:00",
                "2026-10-19T13:00:00+00:00")
    check(res["venue_clashes"] == [] and res["audience_clashes"] == [],
          "rejected events excluded from clash checks")
    for e in fake.store["events"]:
        e["status"] = "pending"

    # 5. Suggested slots: exactly 3, same duration, in 09:00-18:00,
    #    after the requested start, and each clash-free.
    res = clash(venue_a, "2026-10-19T11:00:00+00:00",
                "2026-10-19T13:00:00+00:00")
    slots = res["suggested_slots"]
    check(len(slots) == 3, f"3 suggested slots (got {len(slots)})")
    from datetime import datetime as _dt
    ok = True
    for s in slots:
        st, en = _dt.fromisoformat(s["start_time"]), _dt.fromisoformat(s["end_time"])
        ok = ok and (en - st).total_seconds() == 2 * 3600
        ok = ok and st.time().hour >= 9 and en.time().hour <= 18
        ok = ok and st > _dt.fromisoformat("2026-10-19T11:00:00+00:00")
        recheck = clash(venue_a, s["start_time"], s["end_time"])
        ok = ok and not recheck["venue_clashes"] \
            and not recheck["audience_clashes"] and not recheck["class_clashes"]
    check(ok, "slots: 2h duration, 09:00-18:00, later, all clash-free")

    # 6. Bad input.
    r = c.post("/events/check-clash",
               json={"venue_id": venue_a, "start_time": "2026-10-19T13:00:00+00:00",
                     "end_time": "2026-10-19T12:00:00+00:00"})
    check(r.status_code == 422, f"end<=start -> 422 (got {r.status_code})")
    print("Step 4 OK\n")


if __name__ == "__main__":
    which = sys.argv[1] if len(sys.argv) > 1 else "all"
    if which in ("step2", "all"):
        run_step2()
    if which in ("step3", "all"):
        run_step3()
    if which in ("step4", "all"):
        run_step4()
    print("ALL REQUESTED CHECKS PASSED")
