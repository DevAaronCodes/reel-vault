<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from './components/AppHeader.vue';
import LoadingIndicator from './components/LoadingIndicator.vue';
import MovieCollection from './components/MovieCollection.vue';
import MovieSearch from './components/MovieSearch.vue';
import SearchResults from './components/SearchResults.vue';
import { useMovieCollection } from './composables/useMovieCollection';
import { searchMovies } from './services/movieApi';
import type { MovieSearchResult } from './types/movie';

const results = ref<MovieSearchResult[]>([]);
const loading = ref(false);
const searched = ref(false);
const error = ref('');

const {
  collection,
  filterText,
  filteredCollection,
  hasMovie,
  addMovie,
  updateMovie,
  deleteMovie
} = useMovieCollection();

async function handleSearch(query: string) {
  const trimmed = query.trim();
  error.value = '';

  if (!trimmed) {
    error.value = 'Enter a movie title to search.';
    results.value = [];
    searched.value = false;
    return;
  }

  loading.value = true;
  searched.value = true;

  try {
    results.value = await searchMovies(trimmed);
  } catch (searchError) {
    results.value = [];
    error.value = searchError instanceof Error ? searchError.message : 'Movie search failed.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="app-shell">
    <AppHeader />
    <MovieSearch :loading="loading" @search="handleSearch" />
    <p v-if="error" class="error-message" role="alert">{{ error }}</p>
    <LoadingIndicator v-if="loading" />
    <div class="content-grid">
      <SearchResults
        :results="results"
        :searched="searched"
        :is-saved="hasMovie"
        @add="addMovie"
      />
      <MovieCollection
        v-model:filter-text="filterText"
        :movies="filteredCollection"
        :total-count="collection.length"
        @update="updateMovie"
        @delete="deleteMovie"
      />
    </div>
  </main>
</template>
