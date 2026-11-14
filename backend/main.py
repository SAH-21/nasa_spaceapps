
import sqlite3
from pathlib import Path

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

from backend.auth_database import (
    DEFAULT_DB_PATH,
    create_user,
    get_user_by_id
)
from backend.auth_security import hash_password
from backend.image_processing import IMAGE_PATH
from backend.sonification import generate_sonification

app = FastAPI(
    title="EarthPulse API",
    description="NASA Space Apps Challenge 2026 - Team Vertex",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"]
)


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=12, max_length=128)


class PublicUser(BaseModel):
    id: int
    email: EmailStr
    created_at: str


def get_auth_db_path() -> Path:
    return DEFAULT_DB_PATH


@app.get("/")
def home():
    return {
        "message": "Welcome to EarthPulse API",
        "team": "Team Vertex",
        "challenge": "The Earth Information Jukebox"
    }


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "project": "EarthPulse",
        "backend": "FastAPI"
    }


@app.get("/api/sonification")
def sonification():
    if not IMAGE_PATH.is_file():
        raise HTTPException(
            status_code=404,
            detail="NASA visualization image not found"
        )

    result = generate_sonification(IMAGE_PATH)

    return {
        "status": "success",
        "project": "EarthPulse",
        "source": {
            "title": "Change in Night Lights between 2012 and 2023",
            "organization": "NASA Scientific Visualization Studio",
            "url": "https://svs.gsfc.nasa.gov/5313/"
        },
        "analysis_type": "Relative image brightness sonification",
        "scientific_note": (
            "Frequencies represent relative visible brightness "
            "within an image frame, not calibrated satellite "
            "radiance or direct environmental measurements."
        ),
        "data": result
    }


@app.post(
    "/api/auth/register",
    response_model=PublicUser,
    status_code=201
)
def register(
    request: RegisterRequest,
    db_path: Path = Depends(get_auth_db_path)
):
    password_hash = hash_password(request.password)

    try:
        user_id = create_user(
            email=str(request.email),
            password_hash=password_hash,
            db_path=db_path
        )
    except sqlite3.IntegrityError as exc:
        raise HTTPException(
            status_code=409,
            detail="Email already registered"
        ) from exc

    user = get_user_by_id(user_id, db_path)

    if user is None:
        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve registered user"
        )

    return user
