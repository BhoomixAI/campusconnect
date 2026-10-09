"""Approval workflow (Step 3).

Chain: faculty (step 1) -> hod (step 2) -> dean (step 3).
- A step is actionable only if every earlier step is approved.
- Any rejection sets the event to rejected (chain stops).
- Dean (final) approval sets the event to approved.
"""
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from db import get_supabase
from models import ApprovalOut, DecideRequest

router = APIRouter(prefix="/approvals", tags=["approvals"])

APPROVER_ROLES = ("faculty", "hod", "dean")
FINAL_STEP = 3  # dean


def _db():
    try:
        return get_supabase()
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))


def _event_approvals(sb, event_id: str) -> list:
    res = sb.table("approvals").select("*").eq("event_id", event_id).execute()
    return sorted(res.data, key=lambda a: a["step_order"])


@router.get("/pending", response_model=list[ApprovalOut])
def pending_approvals(role: Optional[str] = Query(default=None)):
    """Pending steps for a role that are currently actionable.

    A pending item is returned only if all earlier steps are approved,
    so each approver sees exactly what they can decide on now.
    """
    if role is None or role not in APPROVER_ROLES:
        raise HTTPException(
            status_code=400,
            detail=f"Query param 'role' is required, one of {list(APPROVER_ROLES)}.",
        )
    sb = _db()
    res = (
        sb.table("approvals")
        .select("*")
        .eq("approver_role", role)
        .eq("status", "pending")
        .execute()
    )
    actionable = []
    for item in res.data:
        steps = _event_approvals(sb, item["event_id"])
        earlier = [s for s in steps if s["step_order"] < item["step_order"]]
        if all(s["status"] == "approved" for s in earlier):
            actionable.append(item)
    return actionable


@router.post("/{approval_id}/decide", response_model=ApprovalOut)
def decide(approval_id: str, payload: DecideRequest):
    sb = _db()
    res = sb.table("approvals").select("*").eq("id", approval_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Approval not found")
    item = res.data[0]
    if item["status"] != "pending":
        raise HTTPException(status_code=409, detail="This step was already decided")

    ev = sb.table("events").select("*").eq("id", item["event_id"]).execute()
    if not ev.data:
        raise HTTPException(status_code=404, detail="Event not found")
    event = ev.data[0]
    if event["status"] in ("approved", "rejected"):
        raise HTTPException(
            status_code=409, detail=f"Event is already {event['status']}"
        )

    # Step-order enforcement: every earlier step must be approved first.
    steps = _event_approvals(sb, item["event_id"])
    earlier = [s for s in steps if s["step_order"] < item["step_order"]]
    if not all(s["status"] == "approved" for s in earlier):
        raise HTTPException(
            status_code=409, detail="Earlier approval steps are not all approved yet"
        )

    upd = (
        sb.table("approvals")
        .update({"status": payload.decision, "comment": payload.comment})
        .eq("id", approval_id)
        .execute()
    )
    updated = upd.data[0]

    # Rejection anywhere kills the event; final (dean) approval clears it.
    if payload.decision == "rejected":
        sb.table("events").update({"status": "rejected"}).eq(
            "id", item["event_id"]
        ).execute()
    elif item["step_order"] == FINAL_STEP:
        sb.table("events").update({"status": "approved"}).eq(
            "id", item["event_id"]
        ).execute()
    return updated
