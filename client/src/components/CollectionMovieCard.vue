<script setup lang="ts">
import type { LibraryMovie, MediaFormat } from '../types/movie';
import { buildPosterUrl } from '../utils/posters';
import MovieEditor from './MovieEditor.vue';

defineProps<{
  movie: LibraryMovie;
}>();

const emit = defineEmits<{
  update: [tmdbId: number, updates: { mediaFormat: MediaFormat; personalRating: number | null }];
  delete: [tmdbId: number];
}>();
</script>

<template>
  <article class="collection-card">
    <img
      v-if="buildPosterUrl(movie.posterPath)"
      :src="buildPosterUrl(movie.posterPath)!"
      :alt="`${movie.title} poster`"
    />
    <div v-else class="poster-fallback small" aria-label="Poster unavailable">No poster</div>
    <div class="collection-content">
      <div class="collection-topline">
        <div>
          <h3>{{ movie.title }}</h3>
          <p>{{ movie.releaseYear ?? 'Unknown year' }}</p>
        </div>
        <button class="ghost-button danger" type="button" @click="emit('delete', movie.tmdbId)">
          Delete
        </button>
      </div>
      <MovieEditor
        :movie="movie"
        @update="emit('update', movie.tmdbId, $event)"
      />
    </div>
  </article>
</template>
