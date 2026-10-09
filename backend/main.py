"""Campus Connect backend — FastAPI app entrypoint (Step 1).

Routers for later steps are included here as empty stubs so the
mounting structure is verified early.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import approvals, attendance, certificates, events, reports

app = FastAPI(title="Campus Connect API", version="0.1.0")

# Allow the local frontend (Vite default port) to call the API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events.router)
app.include_router(approvals.router)
app.include_router(attendance.router)
app.include_router(certificates.router)
app.include_router(reports.router)


@app.get("/health")
def health():
    """Liveness probe used by Step 1 verification."""
    return {"status": "ok"}
