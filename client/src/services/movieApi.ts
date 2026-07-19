import type { MovieSearchResult } from '../types/movie';

interface SearchResponse {
  results: MovieSearchResult[];
}

export async function searchMovies(query: string): Promise<MovieSearchResult[]> {
  const response = await fetch(`/api/movies/search?query=${encodeURIComponent(query)}`, {
    headers: { Accept: 'application/json' }
  });

  const body = (await response.json().catch(() => null)) as Partial<SearchResponse> & {
    error?: string;
  } | null;

  if (!response.ok) {
    throw new Error(body?.error || 'Movie search failed.');
  }

  return body?.results ?? [];
}
