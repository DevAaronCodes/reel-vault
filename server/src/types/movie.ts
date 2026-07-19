export interface MovieSearchResult {
  tmdbId: number;
  title: string;
  releaseYear: number | null;
  releaseDate: string | null;
  posterPath: string | null;
  overview: string;
  rating: number;
}

export interface TmdbSearchResponse {
  results?: TmdbMovie[];
}

export interface TmdbMovie {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  poster_path?: string | null;
  overview?: string;
  vote_average?: number;
  adult?: boolean;
}
