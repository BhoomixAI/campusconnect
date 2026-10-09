"""Supabase client singleton.

Reads credentials ONLY from environment variables (loaded from .env).
If credentials are missing, `supabase` is None so the app can still
start (e.g. GET /health works) and routes return a clear 503 error.
"""
import os

from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = None
if SUPABASE_URL and SUPABASE_KEY:
    from supabase import create_client

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def get_supabase():
    """Return the Supabase client or raise a clear error if unconfigured."""
    if supabase is None:
        raise RuntimeError(
            "Supabase is not configured. Set SUPABASE_URL and SUPABASE_KEY in backend/.env."
        )
    return supabase
