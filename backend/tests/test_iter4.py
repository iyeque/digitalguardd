"""Iteration 4: rhymes audio + stories endpoints."""
import os
import pytest
import requests

BASE = os.environ['REACT_APP_BACKEND_URL'].rstrip('/') if os.environ.get('REACT_APP_BACKEND_URL') else None
# Fallback to frontend .env if test runner doesn't have it exported
if not BASE:
    with open('/app/frontend/.env') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                BASE = line.split('=', 1)[1].strip().rstrip('/')
                break


# ---------- Rhymes index ----------
def test_rhymes_index():
    r = requests.get(f"{BASE}/api/audio/rhymes", timeout=30)
    assert r.status_code == 200
    data = r.json()
    assert "rhymes" in data
    slugs = {x["slug"] for x in data["rhymes"]}
    assert slugs == {"twinkle", "macdonald", "baabaa"}
    titles = {x["slug"]: x["title"] for x in data["rhymes"]}
    assert "Twinkle" in titles["twinkle"]


# ---------- Rhyme audio (real recording, cached) ----------
def test_rhyme_audio_twinkle_and_cache():
    r1 = requests.get(f"{BASE}/api/audio/rhyme/twinkle", timeout=60)
    assert r1.status_code == 200
    assert r1.headers.get("content-type", "").startswith("audio/mpeg")
    assert len(r1.content) > 100_000, f"size={len(r1.content)}"
    # Second call must be cache HIT
    r2 = requests.get(f"{BASE}/api/audio/rhyme/twinkle", timeout=30)
    assert r2.status_code == 200
    assert r2.headers.get("X-Cache") == "HIT"


def test_rhyme_audio_invalid_slug():
    r = requests.get(f"{BASE}/api/audio/rhyme/invalid", timeout=15)
    assert r.status_code == 404


# ---------- Stories ----------
def test_stories_list():
    r = requests.get(f"{BASE}/api/stories", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert "stories" in data
    stories = data["stories"]
    assert len(stories) == 5
    ids = [s["id"] for s in stories]
    assert ids == ["tiny-bunny", "blue-balloon", "sleepy-puppy", "apple-tree", "kind-cloud"]
    for s in stories:
        assert {"id", "title", "color", "lines"} <= set(s.keys())
        assert isinstance(s["lines"], list)
        assert len(s["lines"]) == 6
        assert s["color"].startswith("#")


def test_story_get_by_id():
    r = requests.get(f"{BASE}/api/stories/tiny-bunny", timeout=15)
    assert r.status_code == 200
    s = r.json()
    assert s["id"] == "tiny-bunny"
    assert s["title"] == "Tiny Bunny's First Hop"
    assert len(s["lines"]) == 6


def test_story_get_invalid():
    r = requests.get(f"{BASE}/api/stories/nope", timeout=15)
    assert r.status_code == 404
