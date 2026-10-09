"""Rotating QR token helpers (Step 5).

How it works (explain-to-judges version):
- Time is sliced into 10-second windows: window = int(time.time() // 10).
- The token for an event is "event_id:window:signature", where signature is
  HMAC-SHA256(QR_SECRET, "event_id:window") truncated to 16 hex chars.
  HMAC means only someone holding QR_SECRET can mint a valid token, so
  students cannot forge or screenshot-reuse tokens from other windows.
- Verification recomputes the signature and compares with
  hmac.compare_digest (constant-time, no timing leaks). The current window
  AND the previous one are accepted, so a token shown at the very end of a
  window still scans during the first seconds of the next window.
"""
import hashlib
import hmac
import io
import os
import time

WINDOW_SECONDS = 10
SIG_LEN = 16


def _secret() -> str:
    secret = os.getenv("QR_SECRET")
    if not secret:
        raise RuntimeError(
            "QR_SECRET is not set. Add it to backend/.env (see .env.example)."
        )
    return secret


def current_window(now: float | None = None) -> int:
    return int((now if now is not None else time.time()) // WINDOW_SECONDS)


def _sig(event_id: str, window: int, secret: str) -> str:
    return hmac.new(
        secret.encode(), f"{event_id}:{window}".encode(), hashlib.sha256
    ).hexdigest()[:SIG_LEN]


def make_token(event_id: str, now: float | None = None) -> str:
    """Mint the token for an event for the current 10-second window."""
    window = current_window(now)
    return f"{event_id}:{window}:{_sig(event_id, window, _secret())}"


def verify_token(token: str, now: float | None = None) -> str | None:
    """Return the event_id if the token is valid, else None.

    Accepts the current window or the previous one only — anything older
    (screenshot replay) or from the future is rejected.
    """
    try:
        event_id, window_s, sig = token.split(":")
        window = int(window_s)
    except (ValueError, AttributeError):
        return None
    try:
        secret = _secret()
    except RuntimeError:
        return None
    current = current_window(now)
    if window not in (current, current - 1):
        return None
    expected = _sig(event_id, window, secret)
    if not hmac.compare_digest(expected, sig):
        return None
    return event_id


def qr_png_base64(data: str) -> str:
    """Render `data` as a PNG QR image, returned as a base64 string."""
    import base64

    import qrcode

    img = qrcode.make(data)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode()
