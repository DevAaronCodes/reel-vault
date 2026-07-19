<script setup lang="ts">
import { computed } from 'vue';
import type { LibraryMovie, MediaFormat } from '../types/movie';

const props = defineProps<{
  movie: LibraryMovie;
}>();

const emit = defineEmits<{
  update: [updates: { mediaFormat: MediaFormat; personalRating: number | null }];
}>();

const mediaFormat = computed({
  get: () => props.movie.mediaFormat,
  set: (value: MediaFormat) => emit('update', { mediaFormat: value, personalRating: props.movie.personalRating })
});

const personalRating = computed({
  get: () => props.movie.personalRating ?? '',
  set: (value: string | number) => {
    const parsed = value === '' ? null : Number(value);
    emit('update', {
      mediaFormat: props.movie.mediaFormat,
      personalRating: parsed && parsed >= 1 && parsed <= 10 ? parsed : null
    });
  }
});
</script>

<template>
  <div class="editor">
    <label>
      Format
      <select v-model="mediaFormat">
        <option>DVD</option>
        <option>Blu-ray</option>
        <option>4K UHD</option>
        <option>Digital</option>
      </select>
    </label>
    <label>
      Rating
      <input v-model="personalRating" type="number" min="1" max="10" placeholder="Unrated" />
    </label>
  </div>
</template>
