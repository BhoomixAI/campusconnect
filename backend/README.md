# Campus Connect — Backend (FastAPI + Supabase)

## Prereqs
- Python 3.11+
- A Supabase project (hosted Postgres)

## Setup
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
# edit .env: set SUPABASE_URL, SUPABASE_KEY, QR_SECRET
```

## Database
1. Open your Supabase project → SQL Editor.
2. Run `schema.sql` (creates all tables).
3. Run `seed.sql` (sample venues, users, timetable rows).

## Run
```powershell
cd backend
uvicorn main:app --reload --port 8000
```
- Health check: http://localhost:8000/health
- API docs (Swagger): http://localhost:8000/docs

## Config
Secrets live ONLY in `backend/.env` (never committed):
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `QR_SECRET`
