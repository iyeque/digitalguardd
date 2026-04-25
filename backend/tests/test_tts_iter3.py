"""Iteration 3 backend tests: health + TTS endpoints."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://tiny-learners-60.preview.emergentagent.com").rstrip("/")


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Health ---
class TestHealth:
    def test_health_ok(self, api):
        r = api.get(f"{BASE_URL}/api/health", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data.get("ok") is True
        assert data.get("tts") is True


# --- TTS voices ---
class TestVoices:
    def test_voices_list(self, api):
        r = api.get(f"{BASE_URL}/api/tts/voices", timeout=15)
        assert r.status_code == 200
        data = r.json()
        ids = {v["id"] for v in data["voices"]}
        expected = {"nova", "shimmer", "coral", "fable", "alloy", "sage", "ash", "echo", "onyx"}
        assert ids == expected, f"Unexpected voice ids: {ids}"
        assert data["available"] is True
        assert data["default"] == "nova"


# --- TTS synthesis ---
class TestTts:
    def test_tts_basic_audio(self, api):
        r = api.post(
            f"{BASE_URL}/api/tts",
            json={"text": "A is for Apple iter3 unique", "voice": "nova"},
            timeout=60,
        )
        assert r.status_code == 200, r.text
        assert r.headers.get("content-type", "").startswith("audio/mpeg")
        assert len(r.content) > 5000, f"Audio too small: {len(r.content)} bytes"

    def test_tts_cache_hit(self, api):
        payload = {"text": "Cache check unique iter3 string", "voice": "nova"}
        r1 = api.post(f"{BASE_URL}/api/tts", json=payload, timeout=60)
        assert r1.status_code == 200
        # First call should be MISS (assuming not cached previously)
        # Second call should be HIT
        r2 = api.post(f"{BASE_URL}/api/tts", json=payload, timeout=60)
        assert r2.status_code == 200
        assert r2.headers.get("X-Cache") == "HIT", f"Expected HIT got {r2.headers.get('X-Cache')}"
        assert len(r2.content) == len(r1.content)

    def test_tts_invalid_voice(self, api):
        r = api.post(
            f"{BASE_URL}/api/tts",
            json={"text": "hello", "voice": "invalid"},
            timeout=15,
        )
        assert r.status_code == 400

    def test_tts_empty_text(self, api):
        r = api.post(
            f"{BASE_URL}/api/tts",
            json={"text": "", "voice": "nova"},
            timeout=15,
        )
        assert r.status_code == 422
