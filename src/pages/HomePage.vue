<template>
  <section class="home">
    <h1>Bienvenue sur MyApp</h1>
    <p>
      Calculez facilement votre empreinte carbone pour vos activités en cloud,
      vos vols ou vos projets personnalisés.
    </p>
    <router-link v-if="!isLoggedIn" to="/" class="cta">
      Connectez-vous pour commencer
    </router-link>

    <Dashboard />
  </section>
</template>

<script setup>
import { computed }     from 'vue'
import { useUserStore } from '../stores/user'
import Dashboard from '../components/Dashboard.vue'
const store      = useUserStore()
const isLoggedIn = computed(() => store.isLoggedIn)
</script>

<style scoped>
.home {
  text-align: center;
  color: #333;
}
.home h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.home p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
.home .cta {
  display: inline-block;
  background: #42b983;
  color: #fff;
  padding: 0.8rem 1.6rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s;
}
.home .cta:hover {
  background: #369a6f;
}
</style>
