<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand text-success">
        MyApp
      </router-link>

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

      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <!-- Accueil is always shown -->
          <li class="nav-item">
            <router-link to="/" class="nav-link" exact>Accueil</router-link>
          </li>

          <!-- Only show these if the user is logged in -->
          <li v-if="isLoggedIn" class="nav-item">
            <router-link to="/cloud" class="nav-link">Cloud</router-link>
          </li>
          <li v-if="isLoggedIn" class="nav-item">
            <router-link to="/flights" class="nav-link">Vols</router-link>
          </li>
          <li v-if="isLoggedIn" class="nav-item">
            <router-link to="/energy" class="nav-link">Energy</router-link>
          </li>
          <li v-if="isLoggedIn" class="nav-item">
            <router-link to="/freight" class="nav-link">Freight</router-link>
          </li>
        </ul>

        <div class="d-flex">
          <AuthButtons />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import AuthButtons from './AuthButtons.vue'

const store = useUserStore()
const isLoggedIn = computed(() => store.isLoggedIn)
</script>

<style scoped>
</style>
