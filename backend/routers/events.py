"""Events CRUD (Step 2).

POST /events creates the event with status=pending and auto-creates the
3 approval rows: faculty (step 1) -> hod (step 2) -> dean (step 3).
"""
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from db import get_supabase
from models import ClashCheckRequest, ClashResponse, EventCreate, EventOut
from utils.clash import (
    find_audience_clashes,
    find_class_clashes,
    find_venue_clashes,
    suggest_slots,
)

router = APIRouter(prefix="/events", tags=["events"])

# The fixed multi-level approval chain for every new event.
APPROVAL_CHAIN = [("faculty", 1), ("hod", 2), ("dean", 3)]

EVENT_STATUSES = ("pending", "approved", "rejected")


def _db():
    """Return the Supabase client, or 503 if credentials are missing."""
    try:
        return get_supabase()
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))


@router.post("", response_model=EventOut, status_code=201)
def create_event(payload: EventCreate):
    sb = _db()
    body = payload.model_dump(mode="json")  # UUID/datetime -> plain JSON
    body["status"] = "pending"
    try:
        res = sb.table("events").insert(body).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to create event: {exc}")
    event = res.data[0]
    # Auto-create the 3 approval steps for the new event.
    rows = [
        {
            "event_id": event["id"],
            "approver_role": role,
            "step_order": step,
            "status": "pending",
        }
        for role, step in APPROVAL_CHAIN
    ]
    try:
        sb.table("approvals").insert(rows).execute()
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Event created but approvals failed: {exc}"
        )
    return event


@router.get("", response_model=list[EventOut])
def list_events(status: Optional[str] = Query(default=None)):
    if status is not None and status not in EVENT_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status '{status}'. Use one of {list(EVENT_STATUSES)}.",
        )
    sb = _db()
    query = sb.table("events").select("*")
    if status is not None:
        query = query.eq("status", status)
    res = query.execute()
    return res.data


@router.post("/check-clash", response_model=ClashResponse)
def check_clash(payload: ClashCheckRequest):
    """Detect venue / audience / class clashes + suggest 3 free slots.

    NOTE: declared before GET /{event_id} so "check-clash" is not
    mistaken for an event id.
    """
    sb = _db()
    events = sb.table("events").select("*").execute().data
    if payload.target_dept and payload.target_year is not None:
        timetable = (
            sb.table("timetable")
            .select("*")
            .eq("department", payload.target_dept)
            .eq("year", payload.target_year)
            .execute()
            .data
        )
    else:
        timetable = []

    venue = find_venue_clashes(
        str(payload.venue_id) if payload.venue_id else None,
        payload.start_time,
        payload.end_time,
        events,
    )
    audience = find_audience_clashes(
        payload.target_dept, payload.target_year,
        payload.start_time, payload.end_time, events,
    )
    classes = find_class_clashes(
        payload.target_dept, payload.target_year,
        payload.start_time, payload.end_time, timetable,
    )
    slots = suggest_slots(
        payload.start_time, payload.end_time,
        str(payload.venue_id) if payload.venue_id else None,
        payload.target_dept, payload.target_year, events, timetable,
    )
    return {
        "venue_clashes": [
            {"id": e["id"], "title": e["title"],
             "start_time": e["start_time"], "end_time": e["end_time"]}
            for e in venue
        ],
        "audience_clashes": [
            {"id": e["id"], "title": e["title"],
             "start_time": e["start_time"], "end_time": e["end_time"]}
            for e in audience
        ],
        "class_clashes": [
            {"department": r["department"], "year": r["year"],
             "weekday": r["weekday"], "start_time": str(r["start_time"]),
             "end_time": str(r["end_time"])}
            for r in classes
        ],
        "suggested_slots": slots,
    }


@router.get("/{event_id}", response_model=EventOut)
def get_event(event_id: str):
    sb = _db()
    res = sb.table("events").select("*").eq("id", event_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Event not found")
    return res.data[0]
