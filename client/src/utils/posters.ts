const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342';

export function buildPosterUrl(posterPath: string | null): string | null {
  return posterPath ? `${TMDB_IMAGE_BASE_URL}${posterPath}` : null;
}
