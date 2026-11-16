import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "service" in data
    assert "version" in data

def test_get_feed_success():
    response = client.get("/api/feed")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert len(data["items"]) >= 4
    assert data["total"] >= 4
    
    # Check item schema
    item = data["items"][0]
    assert "id" in item
    assert "title" in item
    assert "image_url" in item
    assert "ingredients" in item
    assert "instructions" in item
    assert len(item["ingredients"]) > 0

def test_get_recipe_by_id_success():
    response = client.get("/api/recipes/kfc-leaked-secret-chicken")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "kfc-leaked-secret-chicken"
    assert data["is_clone_recipe"] is True
    assert len(data["secret_hacks"]) > 0

def test_get_recipe_by_id_not_found():
    response = client.get("/api/recipes/non-existent-recipe-id-xyz")
    assert response.status_code == 404
    assert response.json()["detail"] == "Recipe not found"

def test_feed_category_filter():
    response = client.get("/api/feed?category=Trending")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) > 0
    for item in data["items"]:
        assert any("trending" in t.lower() for t in item["tags"])

