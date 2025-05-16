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
