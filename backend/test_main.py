
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "ok"
    assert data["project"] == "EarthPulse"
    assert data["backend"] == "FastAPI"


def test_sonification_endpoint():
    response = client.get("/api/sonification")

    assert response.status_code == 200

    result = response.json()

    assert result["status"] == "success"
    assert result["project"] == "EarthPulse"
    assert result["analysis_type"] == "Relative image brightness sonification"

    data = result["data"]

    assert data["samples"] == 100
    assert len(data["brightness"]) == 100
    assert len(data["frequencies"]) == 100

    assert all(
        0 <= value <= 1
        for value in data["brightness"]
    )

    assert all(
        180 <= frequency <= 760
        for frequency in data["frequencies"]
    )


def test_cors_preflight():
    response = client.options(
        "/api/sonification",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET"
        }
    )

    assert response.status_code == 200

    assert (
        response.headers["access-control-allow-origin"]
        == "http://localhost:5173"
    )

    assert "GET" in response.headers["access-control-allow-methods"]


def test_missing_image_returns_404(monkeypatch, tmp_path):
    missing_image = tmp_path / "missing.jpg"

    monkeypatch.setattr(
        "backend.main.IMAGE_PATH",
        missing_image
    )

    response = client.get("/api/sonification")

    assert response.status_code == 404

    assert response.json()["detail"] == (
        "NASA visualization image not found"
    )
