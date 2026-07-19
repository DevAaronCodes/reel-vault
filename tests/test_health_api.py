def test_health_endpoint(api, api_base_url):
    response = api.get(f"{api_base_url}/api/health", timeout=5)

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
