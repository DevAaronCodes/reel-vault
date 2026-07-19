<script setup lang="ts">
import type { MovieSearchResult } from '../types/movie';
import { buildPosterUrl } from '../utils/posters';

defineProps<{
  movie: MovieSearchResult;
  saved: boolean;
}>();

const emit = defineEmits<{
  add: [movie: MovieSearchResult];
}>();
</script>

<template>
  <article class="movie-card">
    <img
      v-if="buildPosterUrl(movie.posterPath)"
      :src="buildPosterUrl(movie.posterPath)!"
      :alt="`${movie.title} poster`"
    />
    <div v-else class="poster-fallback" aria-label="Poster unavailable">No poster</div>
    <div class="movie-card-body">
      <div>
        <h3>{{ movie.title }}</h3>
        <p class="meta">
          <span>{{ movie.releaseYear ?? 'Unknown year' }}</span>
          <span>{{ movie.rating.toFixed(1) }}/10</span>
        </p>
      </div>
      <p class="overview">{{ movie.overview || 'No overview available.' }}</p>
      <button type="button" :disabled="saved" @click="emit('add', movie)">
        {{ saved ? 'In collection' : 'Add to collection' }}
      </button>
    </div>
  </article>
</template>
