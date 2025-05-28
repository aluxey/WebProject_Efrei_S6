<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <!-- Logo -->
      <router-link to="/" class="navbar-brand text-success">
        MyApp
      </router-link>

      <!-- Toggler mobile -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNav"
        aria-controls="mainNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Liens -->
      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/" class="nav-link" exact>Accueil</router-link>
          </li>
          <li v-if="isLoggedIn" class="nav-item">
            <router-link to="/cloud" class="nav-link">Cloud</router-link>
          </li>
          <li v-if="isLoggedIn" class="nav-item">
            <router-link to="/flights" class="nav-link">Vols</router-link>
          </li>
          <li v-if="isLoggedIn" class="nav-item">
            <router-link to="/custom" class="nav-link">Personnalisé</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/history" class="nav-link">Historique</router-link>
          </li>
        </ul>

        <!-- Auth buttons à droite -->
        <div class="d-flex">
          <AuthButtons />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed }     from 'vue'
import { useUserStore } from '@/stores/user'
import AuthButtons      from './AuthButtons.vue'

const store = useUserStore()
const isLoggedIn = computed(() => store.isLoggedIn)
</script>

<style scoped>
/* Tu peux retirer le .base-header et .nav-links custom, Bootstrap gère tout */
</style>
