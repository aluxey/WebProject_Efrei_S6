<template>
  <BaseLayout>
    <!-- C’est ici que le router-view doit injecter ta HomePage -->
    <router-view />
  </BaseLayout>
</template>

<script>
import BaseLayout from './components/BaseLayout.vue'

export default {
  name: 'App',
  components: {
    BaseLayout
  }
}
</script>

<style>

/* src/assets/main.css */
:root {
  --font-heading: 'Merriweather', serif;
  --font-body:    'Nunito', sans-serif;
}

body {
  font-family: var(--font-body);
  line-height: 1.6;
  color: #333;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  margin: 1.5rem 0 0.5rem;
}

</style>
