<template>
  <div v-if="visible" class="alert alert-warning alert-dismissible fade show mb-4" role="alert">
    <strong>⚠️ Cette page est créée mais pas encore fonctionnelle.</strong>
    <span class="d-block mt-1">
      L’accès via l’API n’est pas disponible pour le moment. Revenez bientôt !
    </span>
    <button
      type="button"
      class="btn-close"
      aria-label="Fermer"
      @click="visible = false"
    ></button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(true)
</script>

<style scoped>
.alert {
  border-radius: 0.5rem;
  font-size: 1rem;
}
</style>
