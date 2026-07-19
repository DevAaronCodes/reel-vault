import { computed, ref, watch } from 'vue';
import type { LibraryMovie, MediaFormat, MovieSearchResult } from '../types/movie';

const STORAGE_KEY = 'movieShelf.collection.v1';

function loadCollection(): LibraryMovie[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isLibraryMovie) : [];
  } catch {
    return [];
  }
}

function isLibraryMovie(value: unknown): value is LibraryMovie {
  if (!value || typeof value !== 'object') return false;
  const movie = value as Partial<LibraryMovie>;
  return typeof movie.tmdbId === 'number' && typeof movie.title === 'string';
}

export function useMovieCollection() {
  const collection = ref<LibraryMovie[]>(loadCollection());
  const filterText = ref('');

  watch(
    collection,
    (movies) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
    },
    { deep: true }
  );

  const filteredCollection = computed(() => {
    const filter = filterText.value.trim().toLowerCase();
    if (!filter) return collection.value;
    return collection.value.filter((movie) => movie.title.toLowerCase().includes(filter));
  });

  function hasMovie(tmdbId: number): boolean {
    return collection.value.some((movie) => movie.tmdbId === tmdbId);
  }

  function addMovie(movie: MovieSearchResult): boolean {
    if (hasMovie(movie.tmdbId)) return false;

    collection.value = [
      {
        tmdbId: movie.tmdbId,
        title: movie.title,
        releaseYear: movie.releaseYear,
        posterPath: movie.posterPath,
        overview: movie.overview,
        mediaFormat: 'Blu-ray',
        personalRating: null,
        addedAt: new Date().toISOString()
      },
      ...collection.value
    ];

    return true;
  }

  function updateMovie(
    tmdbId: number,
    updates: { mediaFormat: MediaFormat; personalRating: number | null }
  ) {
    collection.value = collection.value.map((movie) =>
      movie.tmdbId === tmdbId ? { ...movie, ...updates } : movie
    );
  }

  function deleteMovie(tmdbId: number) {
    collection.value = collection.value.filter((movie) => movie.tmdbId !== tmdbId);
  }

  return {
    collection,
    filterText,
    filteredCollection,
    hasMovie,
    addMovie,
    updateMovie,
    deleteMovie
  };
}
