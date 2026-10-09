"""Pydantic request/response models."""
from datetime import datetime
from typing import Literal, Optional
from uuid import UUID

from pydantic import BaseModel, model_validator


class EventCreate(BaseModel):
    """Body for POST /events."""

    title: str
    description: Optional[str] = None
    club: Optional[str] = None
    organizer_id: UUID
    venue_id: Optional[UUID] = None
    start_time: datetime
    end_time: datetime
    target_dept: Optional[str] = None
    target_year: Optional[int] = None

    @model_validator(mode="after")
    def end_after_start(self):
        if self.end_time <= self.start_time:
            raise ValueError("end_time must be after start_time")
        return self


class EventOut(EventCreate):
    """Event row returned by the API."""

    id: UUID
    status: str
    created_at: datetime


class ApprovalOut(BaseModel):
    """Approval step row."""

    id: UUID
    event_id: UUID
    approver_role: str
    step_order: int
    status: str
    comment: Optional[str] = None
    updated_at: datetime


class DecideRequest(BaseModel):
    """Body for POST /approvals/{id}/decide."""

    decision: Literal["approved", "rejected"]
    comment: Optional[str] = None


class ClashCheckRequest(BaseModel):
    """Body for POST /events/check-clash."""

    venue_id: Optional[UUID] = None
    start_time: datetime
    end_time: datetime
    target_dept: Optional[str] = None
    target_year: Optional[int] = None

    @model_validator(mode="after")
    def end_after_start(self):
        if self.end_time <= self.start_time:
            raise ValueError("end_time must be after start_time")
        return self


class ClashEventItem(BaseModel):
    id: UUID
    title: str
    start_time: datetime
    end_time: datetime


class ClassClashItem(BaseModel):
    department: str
    year: int
    weekday: int
    start_time: str
    end_time: str


class SlotOut(BaseModel):
    start_time: datetime
    end_time: datetime


class ClashResponse(BaseModel):
    venue_clashes: list[ClashEventItem]
    audience_clashes: list[ClashEventItem]
    class_clashes: list[ClassClashItem]
    suggested_slots: list[SlotOut]


class RegisterRequest(BaseModel):
    """Body for POST /events/{id}/register."""

    user_id: UUID


class RegistrationOut(BaseModel):
    id: UUID
    event_id: UUID
    user_id: UUID
    registered_at: datetime


class QRTokenOut(BaseModel):
    """Rotating token + QR image (PNG as base64) for display/scanning."""

    event_id: UUID
    token: str
    qr_png_base64: str
    window_seconds: int = 10


class CheckinRequest(BaseModel):
    """Body for POST /attendance/checkin."""

    token: str
    user_id: UUID
    lat: float
    lng: float


class AttendanceOut(BaseModel):
    id: UUID
    event_id: UUID
    user_id: UUID
    checked_in_at: datetime
    lat: Optional[float] = None
    lng: Optional[float] = None
