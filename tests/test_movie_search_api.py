def test_movie_search_requires_query(api, api_base_url):
    response = api.get(f"{api_base_url}/api/movies/search", timeout=5)

    assert response.status_code == 400
    assert "TMDB" not in response.text


def test_movie_search_rejects_empty_query(api, api_base_url):
    response = api.get(f"{api_base_url}/api/movies/search", params={"query": "   "}, timeout=5)

    assert response.status_code == 400
    assert "TMDB" not in response.text


def test_movie_search_returns_normalized_results(api, api_base_url):
    response = api.get(f"{api_base_url}/api/movies/search", params={"query": "Alien"}, timeout=5)

    assert response.status_code == 200
    body = response.json()
    assert body == {
        "results": [
            {
                "tmdbId": 348,
                "title": "Alien",
                "releaseYear": 1979,
                "releaseDate": "1979-05-25",
                "posterPath": "/sample-poster.jpg",
                "overview": "A test movie overview.",
                "rating": 8.2,
            }
        ]
    }


def test_movie_search_upstream_failure_is_sanitized(api, api_base_url):
    response = api.get(
        f"{api_base_url}/api/movies/search",
        params={"query": "upstream-failure"},
        timeout=5,
    )

    assert response.status_code == 502
    assert response.json() == {"error": "Movie search service is temporarily unavailable."}


def test_movie_search_does_not_expose_token(api, api_base_url):
    token = "test-token"
    response = api.get(f"{api_base_url}/api/movies/search", params={"query": "Alien"}, timeout=5)

    assert response.status_code == 200
    assert token not in response.text
