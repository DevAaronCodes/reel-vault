<script setup lang="ts">
import type { MovieSearchResult } from '../types/movie';
import EmptyState from './EmptyState.vue';
import SearchMovieCard from './SearchMovieCard.vue';

defineProps<{
  results: MovieSearchResult[];
  searched: boolean;
  isSaved: (tmdbId: number) => boolean;
}>();

const emit = defineEmits<{
  add: [movie: MovieSearchResult];
}>();
</script>

<template>
  <section class="panel">
    <div class="section-heading">
      <h2>Search Results</h2>
    </div>
    <EmptyState
      v-if="searched && results.length === 0"
      title="No movies found"
      message="Try a different title or a shorter search phrase."
    />
    <EmptyState
      v-else-if="!searched"
      title="Search TMDB"
      message="Use the search field to find movies to add to your shelf."
    />
    <div v-else class="movie-grid">
      <SearchMovieCard
        v-for="movie in results"
        :key="movie.tmdbId"
        :movie="movie"
        :saved="isSaved(movie.tmdbId)"
        @add="emit('add', $event)"
      />
    </div>
  </section>
</template>
