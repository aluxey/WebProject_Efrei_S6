<template>
  <div class="d-flex flex-column min-vh-100">
    <BaseHeader/>
    <main class="flex-fill container-fluid px-4 py-3 bg-light">
      <slot/>
    </main>
    <BaseFooter/>
  </div>
</template>

<script setup>
import BaseHeader from './BaseHeader.vue'
import BaseFooter from './BaseFooter.vue'
</script>

<style scoped>
main.container-fluid {
  max-width: 100%;
}
main {
  background-color: #f8f9fa;
}
.inner {
  max-width: 1024px;
  margin: 0 auto;
}
</style>
