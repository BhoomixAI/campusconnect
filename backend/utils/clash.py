"""Clash detection helpers (Step 4).

Core rule — two time intervals overlap iff:
    new_start < existing_end AND new_end > existing_start
(Boundary touch, e.g. one ends exactly when the other starts, is NOT a clash.)

Three clash kinds:
- venue: same venue_id, existing event not rejected, times overlap.
- audience: same target_dept + target_year, not rejected, times overlap.
- class: timetable rows for that dept/year on the weekday(s) the new event
  spans, whose class time overlaps the event's time on that day.

Slot suggestions: step forward in 1-hour increments; a candidate counts only
if it fits fully inside 09:00-18:00 of a single day; return the first 3 with
zero clashes of any kind (searches up to 7 days ahead).
"""
from datetime import datetime, time, timedelta


def overlaps(new_start: datetime, new_end: datetime,
             existing_start: datetime, existing_end: datetime) -> bool:
    """True iff the two intervals overlap (boundary touch is fine)."""
    return new_start < existing_end and new_end > existing_start


def _parse_dt(value):
    """Parse an ISO string from the DB into a datetime (handles trailing Z)."""
    if isinstance(value, datetime):
        return value
    return datetime.fromisoformat(str(value).replace("Z", "+00:00"))


def _aware(dt: datetime) -> datetime:
    """Treat naive datetimes as UTC so comparisons never mix naive/aware."""
    from datetime import timezone

    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


def find_venue_clashes(venue_id, new_start, new_end, events) -> list:
    """Existing non-rejected events at the same venue with overlapping times."""
    if not venue_id:
        return []
    out = []
    for e in events:
        if e.get("status") == "rejected":
            continue
        if str(e.get("venue_id")) != str(venue_id):
            continue
        if overlaps(new_start, new_end,
                    _aware(_parse_dt(e["start_time"])),
                    _aware(_parse_dt(e["end_time"]))):
            out.append(e)
    return out


def find_audience_clashes(target_dept, target_year, new_start, new_end, events) -> list:
    """Non-rejected events aimed at the same dept+year with overlapping times."""
    if not target_dept or target_year is None:
        return []  # open-to-all events have no single audience to clash with
    out = []
    for e in events:
        if e.get("status") == "rejected":
            continue
        if e.get("target_dept") != target_dept:
            continue
        if e.get("target_year") != target_year:
            continue
        if overlaps(new_start, new_end,
                    _aware(_parse_dt(e["start_time"])),
                    _aware(_parse_dt(e["end_time"]))):
            out.append(e)
    return out


def _parse_time(value) -> time:
    if isinstance(value, time):
        return value
    return time.fromisoformat(str(value))


def find_class_clashes(target_dept, target_year, new_start, new_end,
                       timetable_rows) -> list:
    """Timetable rows (dept/year/weekday) overlapping the event's class hours.

    weekday convention (matches schema.sql): 0=Monday .. 6=Sunday, which is
    exactly what date.weekday() returns. Multi-day events are checked day by day.
    """
    if not target_dept or target_year is None:
        return []
    new_start, new_end = _aware(new_start), _aware(new_end)
    out = []
    day = new_start.date()
    while day <= new_end.date():
        weekday = day.weekday()
        # The slice of the event that falls on this calendar day.
        day_start = _aware(datetime.combine(day, time.min).replace(
            tzinfo=new_start.tzinfo))
        day_end = day_start + timedelta(days=1)
        slice_start = max(new_start, day_start)
        slice_end = min(new_end, day_end)
        if slice_start < slice_end:
            for row in timetable_rows:
                if row.get("department") != target_dept:
                    continue
                if row.get("year") != target_year:
                    continue
                if row.get("weekday") != weekday:
                    continue
                row_start = _parse_time(row["start_time"])
                row_end = _parse_time(row["end_time"])
                # Compare on time-of-day: slice times reduced to .time().
                if (slice_start.time() < row_end
                        and slice_end.time() > row_start):
                    out.append(row)
        day += timedelta(days=1)
    return out


def suggest_slots(new_start, new_end, venue_id, target_dept, target_year,
                  events, timetable_rows, count: int = 3,
                  open_hour: int = 9, close_hour: int = 18,
                  max_days: int = 7) -> list:
    """First `count` clash-free slots of the same duration, stepping +1 hour.

    Candidates start one hour after the requested start and must fit fully
    inside 09:00-18:00 of a single day. Only slots with zero venue, audience
    AND class clashes are returned.
    """
    new_start, new_end = _aware(new_start), _aware(new_end)
    duration = new_end - new_start
    day_open = time(open_hour, 0)
    day_close = time(close_hour, 0)

    suggestions = []
    # First candidate: requested start rounded up to the next whole hour.
    cursor = (new_start.replace(minute=0, second=0, microsecond=0)
              + timedelta(hours=1))
    deadline = new_start + timedelta(days=max_days)
    while len(suggestions) < count and cursor < deadline:
        cand_end = cursor + duration
        fits_one_day = cursor.date() == cand_end.date()
        in_hours = day_open <= cursor.time() and cand_end.time() <= day_close
        if fits_one_day and in_hours:
            clash_free = (
                not find_venue_clashes(venue_id, cursor, cand_end, events)
                and not find_audience_clashes(target_dept, target_year,
                                              cursor, cand_end, events)
                and not find_class_clashes(target_dept, target_year,
                                           cursor, cand_end, timetable_rows)
            )
            if clash_free:
                suggestions.append({"start_time": cursor, "end_time": cand_end})
        cursor += timedelta(hours=1)
    return suggestions
