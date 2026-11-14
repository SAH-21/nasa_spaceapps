
from fastapi import FastAPI, HTTPException

from backend.image_processing import IMAGE_PATH
from backend.sonification import generate_sonification

app = FastAPI(
    title="EarthPulse API",
    description="NASA Space Apps Challenge 2026 - Team Vertex",
    version="1.0.0"
)


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
