<template>
  <div class="base-layout">
    <BaseHeader />
    <main class="content">
      <!-- Le <router-view> dans App.vue se glissera ici -->
      <slot />
    </main>
    <BaseFooter />
  </div>
</template>

<script>
import BaseHeader from './BaseHeader.vue'
import BaseFooter from './BaseFooter.vue'

export default {
  name: 'BaseLayout',
  components: {
    BaseHeader,
    BaseFooter
  }
}
</script>

<style scoped>
.base-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.content {
  flex: 1;
  padding: 1rem;
}
</style>
