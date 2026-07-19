import os

import pytest
import requests


@pytest.fixture(scope="session")
def api_base_url():
    return os.environ.get("API_BASE_URL", "http://localhost:3001")


@pytest.fixture()
def api(api_base_url):
    session = requests.Session()
    session.headers.update({"Accept": "application/json"})
    yield session
    session.close()
