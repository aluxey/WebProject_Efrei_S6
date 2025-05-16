<!-- src/components/SigninButtonGoogle.vue -->
<template>
  <!-- le composant GoogleLogin encapsule ta logique OAuth -->
  <GoogleLogin
    :client_id="clientId"
    :scope="'profile email'"
    @success="handleSuccess"
    @error="handleError"
  >
    <!-- slot par défaut : ton AsyncButton -->
    <AsyncButton color="warn">
      <template #default>
        <span v-if="user">👋 {{ user.name }}</span>
        <span v-else>Se connecter avec Google</span>
      </template>
    </AsyncButton>
  </GoogleLogin>
</template>

<script setup>
import { ref, computed } from 'vue'
import AsyncButton       from './AsyncButton.vue'
import GoogleLogin       from 'vue3-google-login'
import { useUserStore }  from '../stores/user'

const store    = useUserStore()
const user     = computed(() => store.currentUser)
const clientId = import.meta.env.VUE_APP_OAUTH_GOOGLE_CLIENT_ID

function handleSuccess(credentialResponse) {
  // Le JWT Google se trouve dans credentialResponse.credential
  const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]))
  const profile = {
    name:     payload.name,
    username: payload.email,
    avatar:   payload.picture
  }
  store.setProfile(profile)
}

function handleError(error) {
  console.error('Google login failed', error)
}
</script>
