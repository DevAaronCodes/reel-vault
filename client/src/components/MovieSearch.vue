<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  loading: boolean;
}>();

const emit = defineEmits<{
  search: [query: string];
}>();

const query = ref('');

function submitSearch() {
  emit('search', query.value);
}
</script>

<template>
  <form class="movie-search" @submit.prevent="submitSearch">
    <label for="movie-query">Find a movie</label>
    <div class="search-row">
      <input
        id="movie-query"
        v-model="query"
        type="search"
        placeholder="Alien, Heat, Inception..."
        autocomplete="off"
      />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Searching' : 'Search' }}
      </button>
    </div>
  </form>
</template>
