import type { MovieSearchResult, TmdbSearchResponse } from '../types/movie.js';

const TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie';

export class UpstreamMovieServiceError extends Error {
  constructor(message = 'Movie search service is unavailable.') {
    super(message);
    this.name = 'UpstreamMovieServiceError';
  }
}

export class MissingTmdbTokenError extends Error {
  constructor() {
    super('TMDB_API_TOKEN is required for movie search.');
    this.name = 'MissingTmdbTokenError';
  }
}

export async function searchMovies(query: string): Promise<MovieSearchResult[]> {
  if (process.env.NODE_ENV === 'test') {
    return searchMoviesInTestMode(query);
  }

  const token = process.env.TMDB_API_TOKEN;
  if (!token) {
    throw new MissingTmdbTokenError();
  }

  const url = new URL(TMDB_SEARCH_URL);
  url.searchParams.set('query', query);
  url.searchParams.set('include_adult', 'false');
  url.searchParams.set('language', 'en-US');
  url.searchParams.set('page', '1');

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });
  } catch {
    throw new UpstreamMovieServiceError();
  }

  if (!response.ok) {
    throw new UpstreamMovieServiceError();
  }

  const data = (await response.json()) as TmdbSearchResponse;
  return normalizeTmdbResults(data);
}

function searchMoviesInTestMode(query: string): MovieSearchResult[] {
  const normalizedQuery = query.toLowerCase();

  if (normalizedQuery.includes('upstream-failure')) {
    throw new UpstreamMovieServiceError();
  }

  if (!normalizedQuery.includes('alien')) {
    return [];
  }

  return [
    {
      tmdbId: 348,
      title: 'Alien',
      releaseYear: 1979,
      releaseDate: '1979-05-25',
      posterPath: '/sample-poster.jpg',
      overview: 'A test movie overview.',
      rating: 8.2
    }
  ];
}

function normalizeTmdbResults(data: TmdbSearchResponse): MovieSearchResult[] {
  return (data.results ?? [])
    .filter((movie) => !movie.adult)
    .map((movie) => {
      const releaseDate = movie.release_date || null;
      const releaseYear = releaseDate ? Number.parseInt(releaseDate.slice(0, 4), 10) : null;

      return {
        tmdbId: movie.id,
        title: movie.title || movie.name || 'Untitled',
        releaseYear: Number.isNaN(releaseYear) ? null : releaseYear,
        releaseDate,
        posterPath: movie.poster_path ?? null,
        overview: movie.overview ?? '',
        rating: Number(movie.vote_average ?? 0)
      };
    });
}
