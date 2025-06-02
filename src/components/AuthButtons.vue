<!-- src/components/AuthButtons.vue -->
<template>
  <div class="auth-buttons">
    <template v-if="isLoggedIn">
      <span class="welcome">Bienvenue, {{ userName }}</span>
      <BaseButton @click="logout" class="btn-logout">
        Déconnexion
      </BaseButton>
    </template>
    <template v-else>
      <SigninButtonMicrosoft class="btn-ms" />
      <BaseButton @click="googleLogin" class="btn-gg">
        Se connecter avec Google
      </BaseButton>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/user'
import BaseButton from './BaseButton.vue'
import SigninButtonMicrosoft from './SigninButtonMicrosoft.vue'

// ← On importe useGoogleAuth pour récupérer signInWithGoogle et logout
import { useGoogleAuth } from '@/api/useGoogleAuth'

const store = useUserStore()
const { signInWithGoogle, logout } = useGoogleAuth()

async function googleLogin() {
  try {
    await signInWithGoogle()
    // onAuthStateChanged() mettra à jour Pinia
  } catch (err) {
    console.error('Échec du login Google :', err)
    alert("Impossible de se connecter avec Google.")
  }
}

const user = computed(() => store.currentUser)
const isLoggedIn = computed(() => store.isLoggedIn)

const userName = computed(() => {
  // Si Microsoft : user.name ; Si Google : user.displayName
  return user.value?.name || user.value?.displayName || 'Utilisateur'
})
</script>

<style scoped>
.auth-buttons {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.welcome {
  color: #fff;
  font-weight: 500;
  margin-right: 1rem;
}

.btn-ms {
  --btn-bg: #0078d4;
  --btn-hover-bg: #005a9e;
}

.btn-gg {
  --btn-bg: #db4437;
  --btn-hover-bg: #a3332a;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  font-weight: 500;
  border-radius: 0.25rem;
  background-color: var(--btn-bg);
  transition: background-color 0.2s;
}
.btn-gg:hover {
  background-color: var(--btn-hover-bg);
}

.btn-logout {
  --btn-bg: transparent;
  --btn-hover-bg: rgba(255,255,255,0.1);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.7);
  padding: 0.4rem 0.8rem;
  font-weight: 500;
  border-radius: 0.25rem;
  background-color: var(--btn-bg);
  transition: background-color 0.2s;
}
.btn-logout:hover {
  background-color: var(--btn-hover-bg);
}
</style>
