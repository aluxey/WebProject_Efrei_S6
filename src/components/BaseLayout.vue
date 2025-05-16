<template>
  <div class="base-layout">
    <BaseHeader/>
    <main class="content">
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
.base-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.content {
  flex: 1;
  max-width: 1024px;
  margin: 2rem auto;
  padding: 0 1rem;
  box-sizing: border-box;
}
</style>
