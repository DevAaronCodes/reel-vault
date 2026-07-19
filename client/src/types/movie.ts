export type MediaFormat = 'DVD' | 'Blu-ray' | '4K UHD' | 'Digital';

export interface MovieSearchResult {
  tmdbId: number;
  title: string;
  releaseYear: number | null;
  releaseDate: string | null;
  posterPath: string | null;
  overview: string;
  rating: number;
}

export interface LibraryMovie {
  tmdbId: number;
  title: string;
  releaseYear: number | null;
  posterPath: string | null;
  overview: string;
  mediaFormat: MediaFormat;
  personalRating: number | null;
  addedAt: string;
}
