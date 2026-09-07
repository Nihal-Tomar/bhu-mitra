"""
BhuMitra — Intelligence & Decision Support Service
FastAPI application entry point
Port: 8000
"""

import os
import time
from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="BhuMitra Intelligence Service",
    description="National Land Acquisition Predictive Intelligence & Decision Support Service",
    version="1.0.0-sih",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

START_TIME = time.time()


class HealthDetails(BaseModel):
    service: str
    status: str
    uptime_seconds: float
    timestamp: str
    version: str
    engine: str


@app.get("/", tags=["Root"])
def read_root():
    return {
        "service": "BhuMitra Intelligence Service",
        "tagline": "National Land Acquisition Predictive Intelligence & Decision Support",
        "docs": "/docs",
        "health": "/health",
        "version": "1.0.0-sih",
    }


@app.get("/health", response_model=HealthDetails, tags=["Health"])
def health_check():
    return HealthDetails(
        service="intelligence",
        status="healthy",
        uptime_seconds=round(time.time() - START_TIME, 2),
        timestamp=datetime.now(timezone.utc).isoformat(),
        version="1.0.0-sih",
        engine="heuristic-scoring-v1",
    )


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
