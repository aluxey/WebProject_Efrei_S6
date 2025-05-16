<template>
  <header class="base-header">
    <div class="container">
      <router-link to="/" class="logo">MyApp</router-link>
      <nav class="nav-links">
        <router-link to="/" exact>Accueil</router-link>
        <router-link v-if="isLoggedIn" to="/cloud">Cloud</router-link>
        <router-link v-if="isLoggedIn" to="/flights">Vols</router-link>
        <router-link v-if="isLoggedIn" to="/custom">Personnalisé</router-link>
        <router-link to="/history">Historique</router-link>
      </nav>
      <AuthButtons />
    </div>
  </header>
</template>

<script setup>
import { computed }     from 'vue'
import { useUserStore } from '../stores/user'
import AuthButtons      from './AuthButtons.vue'
import { RouterLink }   from 'vue-router'

const store = useUserStore()
const isLoggedIn = computed(() => store.isLoggedIn)
</script>

<style scoped>
.base-header {
  position: sticky;
  top: 0;
  background: #1f1f1f;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  z-index: 10;
}
.container {
  display: flex;
  align-items: center;
  max-width: 1024px;
  margin: 0 auto;
  padding: 0.6rem 1rem;
}
.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #42b983;
  margin-right: 2rem;
  text-decoration: none;
}
.nav-links {
  display: flex;
  gap: 1rem;
  flex: 1;
}
.nav-links a {
  color: #eee;
  text-decoration: none;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  transition: background 0.2s;
}
.nav-links a.router-link-active,
.nav-links a:hover {
  background: rgba(255,255,255,0.1);
}
</style>
