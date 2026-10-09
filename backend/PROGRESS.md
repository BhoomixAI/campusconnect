# Campus Connect — Build Progress

## Step 1: Project setup — DONE
- Built: `requirements.txt`, `.env.example`, `db.py` (Supabase client, tolerant of
  missing creds), `main.py` (FastAPI + CORS for localhost:3000 + `GET /health` +
  router stubs), `schema.sql` (9 tables + indexes), `seed.sql` (3 venues, 5 users,
  7 timetable rows), `README.md`, `models.py` + router/utils stubs, `.gitignore`
  updated with `.env`.
- Tested: `GET /health` returns `{"status": "ok"}` (see verification below).
  Verification (09 Oct 2026, run locally):
  - `TestClient(app).get("/health")` → 200 `{"status": "ok"}`, `/docs` → 200.
  - Real server: `uvicorn main:app --port 8001` + `GET /health` → 200 `{"status":"ok"}`.
  - CORS: request with `Origin: http://localhost:3000` returns
    `access-control-allow-origin: http://localhost:3000`.
  - Secrets check: no hardcoded keys (only `os.getenv` in `db.py` + placeholders
    in `.env.example`).
- Pending: Steps 2–7.
- Known issues: none. DB not yet connected (needs real `.env` + running
  `schema.sql`/`seed.sql` in Supabase).

## Step 2: Events CRUD + automatic approval rows — DONE
- Built: `models.py` (`EventCreate` with end_time>start_time validator, `EventOut`);
  `routers/events.py` (`POST /events` → 201 pending + auto-creates faculty-1/hod-2/
  dean-3 approval rows; `GET /events?status=` with status validation;
  `GET /events/{id}` with 404). Unconfigured DB → 503 with clear JSON message.
- Tested: `python verify_steps.py step2` → 13/13 PASS (create, chain rows,
  list/filter, get, 404, 422 x2, 400). Live server: `/health` 200, `/events`
  without creds → 503 `{"detail": "Supabase is not configured..."}` as designed.
- Known issues: none. Tests use in-memory FakeSupabase (no real creds on this machine).
## Step 3: Approval workflow with step-order enforcement — DONE
- Built: `models.py` (`ApprovalOut`, `DecideRequest` with approved|rejected literal);
  `routers/approvals.py` (`GET /approvals/pending?role=` returns only steps whose
  earlier steps are all approved; `POST /approvals/{id}/decide` enforces order with
  409 on violations, 404 on unknown id, 409 on re-decide/decided event; any
  rejection → event rejected; dean (final) approval → event approved).
- Tested: `python verify_steps.py all` → Steps 2+3 all PASS (31 checks), incl.
  out-of-order 409, mid-chain event still pending, full chain → approved,
  rejection path → rejected + chain frozen, bad role → 400.
- Known issues: none.
## Step 4: Clash detection + slot suggestions — DONE
- Built: `utils/clash.py` (`overlaps` boundary-touch rule, venue/audience/class
  finders, `suggest_slots` +1h steps within 09:00-18:00 single days, up to 7 days
  ahead); `models.py` (`ClashCheckRequest/Response` + items); `POST
  /events/check-clash` in `routers/events.py` (declared before `/{event_id}`).
  Decisions: rejected events ignored; audience check needs dept+year set;
  weekday uses date.weekday() (Mon=0, matches schema); suggestions are later
  alternatives, never the queried slot itself.
- Tested: `python verify_steps.py all` → 42/42 PASS (Steps 2+3+4), incl.
  venue/audience/class hits + misses, boundary touch OK, rejected excluded,
  3 slots verified clash-free by re-query, 422 on bad input. Live server boots,
  `/health` 200.
- Known issues: none.
## Step 5: Registration + rotating QR + geofenced check-in — PENDING
## Step 6: Certificates + public verification + certificate PDF — PENDING
## Step 7: NAAC report PDF — PENDING
