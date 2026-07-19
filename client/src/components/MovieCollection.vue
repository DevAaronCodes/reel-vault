<script setup lang="ts">
import type { LibraryMovie, MediaFormat } from '../types/movie';
import CollectionMovieCard from './CollectionMovieCard.vue';
import EmptyState from './EmptyState.vue';

defineProps<{
  movies: LibraryMovie[];
  totalCount: number;
  filterText: string;
}>();

const emit = defineEmits<{
  'update:filterText': [value: string];
  update: [tmdbId: number, updates: { mediaFormat: MediaFormat; personalRating: number | null }];
  delete: [tmdbId: number];
}>();

function forwardUpdate(
  tmdbId: number,
  updates: { mediaFormat: MediaFormat; personalRating: number | null }
) {
  emit('update', tmdbId, updates);
}
</script>

<template>
  <section class="panel">
    <div class="section-heading collection-heading">
      <div>
        <h2>My Collection</h2>
        <p>{{ totalCount }} saved {{ totalCount === 1 ? 'movie' : 'movies' }}</p>
      </div>
      <input
        :value="filterText"
        type="search"
        placeholder="Filter collection"
        aria-label="Filter collection by title"
        @input="emit('update:filterText', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <EmptyState
      v-if="totalCount === 0"
      title="Your shelf is empty"
      message="Search for a movie and add it to start building your collection."
    />
    <EmptyState
      v-else-if="movies.length === 0"
      title="No saved movies match"
      message="Clear or change the filter to see more of your collection."
    />
    <div v-else class="collection-list">
      <CollectionMovieCard
        v-for="movie in movies"
        :key="movie.tmdbId"
        :movie="movie"
        @update="forwardUpdate"
        @delete="emit('delete', $event)"
      />
    </div>
  </section>
</template>
