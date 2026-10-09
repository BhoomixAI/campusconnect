"""Registration + rotating-QR + geofenced check-in (Step 5).

- POST /events/{event_id}/register: approved events only, no duplicates.
- GET /events/{event_id}/qr-token: current rotating token + QR PNG (base64).
- POST /attendance/checkin: token must be valid, user registered, within
  100 m of the venue, and not already checked in — each failure has its
  own clear error message.
"""
from fastapi import APIRouter, HTTPException

from db import get_supabase
from models import (
    AttendanceOut,
    CheckinRequest,
    QRTokenOut,
    RegisterRequest,
    RegistrationOut,
)
from utils.geo import haversine_m
from utils.qr_token import WINDOW_SECONDS, make_token, qr_png_base64, verify_token

router = APIRouter(tags=["attendance"])

GEOFENCE_M = 100.0


def _db():
    try:
        return get_supabase()
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))


def _get_event_or_404(sb, event_id: str) -> dict:
    res = sb.table("events").select("*").eq("id", event_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Event not found")
    return res.data[0]


@router.post("/events/{event_id}/register", response_model=RegistrationOut,
             status_code=201)
def register(event_id: str, payload: RegisterRequest):
    sb = _db()
    event = _get_event_or_404(sb, event_id)
    if event["status"] != "approved":
        raise HTTPException(
            status_code=409,
            detail=f"Cannot register: event is '{event['status']}', not approved",
        )
    existing = (
        sb.table("registrations")
        .select("*")
        .eq("event_id", event_id)
        .eq("user_id", str(payload.user_id))
        .execute()
    )
    if existing.data:
        raise HTTPException(status_code=409, detail="User already registered")
    res = (
        sb.table("registrations")
        .insert({"event_id": event_id, "user_id": str(payload.user_id)})
        .execute()
    )
    return res.data[0]


@router.get("/events/{event_id}/qr-token", response_model=QRTokenOut)
def qr_token(event_id: str):
    sb = _db()
    _get_event_or_404(sb, event_id)
    try:
        token = make_token(event_id)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    return {
        "event_id": event_id,
        "token": token,
        "qr_png_base64": qr_png_base64(token),
        "window_seconds": WINDOW_SECONDS,
    }


@router.post("/attendance/checkin", response_model=AttendanceOut, status_code=201)
def checkin(payload: CheckinRequest):
    sb = _db()
    # 1. Token must be valid (current or previous 10 s window only).
    event_id = verify_token(payload.token)
    if event_id is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    event = _get_event_or_404(sb, event_id)

    # 2. User must be registered for this event.
    reg = (
        sb.table("registrations")
        .select("*")
        .eq("event_id", event_id)
        .eq("user_id", str(payload.user_id))
        .execute()
    )
    if not reg.data:
        raise HTTPException(
            status_code=403, detail="User is not registered for this event"
        )

    # 3. User must be within 100 m of the venue (proxy-proof geofence).
    venue = None
    if event.get("venue_id"):
        vres = sb.table("venues").select("*").eq("id", event["venue_id"]).execute()
        venue = vres.data[0] if vres.data else None
    if venue is None or venue.get("latitude") is None or venue.get("longitude") is None:
        raise HTTPException(
            status_code=500, detail="Venue location is not configured"
        )
    dist = haversine_m(payload.lat, payload.lng,
                       venue["latitude"], venue["longitude"])
    if dist > GEOFENCE_M:
        raise HTTPException(
            status_code=403,
            detail=f"Too far from venue: {dist:.0f} m away (must be within "
                   f"{GEOFENCE_M:.0f} m)",
        )

    # 4. No double check-in.
    already = (
        sb.table("attendance")
        .select("*")
        .eq("event_id", event_id)
        .eq("user_id", str(payload.user_id))
        .execute()
    )
    if already.data:
        raise HTTPException(status_code=409, detail="User already checked in")

    res = (
        sb.table("attendance")
        .insert({"event_id": event_id, "user_id": str(payload.user_id),
                 "lat": payload.lat, "lng": payload.lng})
        .execute()
    )
    return res.data[0]
