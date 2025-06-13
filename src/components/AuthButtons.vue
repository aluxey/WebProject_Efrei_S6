<!-- src/components/AuthButtons.vue -->
<template>
  <div class="auth-buttons">
    <template v-if="isLoggedIn">
      <span class="welcome">Bienvenue, {{ userName }}</span>
      <BaseButton @click="logoutAll" class="btn-logout">
        Déconnexion
      </BaseButton>
    </template>
    <template v-else>
      <!-- Votre bouton MSAL reste le même, il update store.provider à "microsoft" -->
      <SigninButtonMicrosoft class="btn-ms" />
      <BaseButton @click="googleLogin" class="btn-gg">
        Se connecter avec Google
      </BaseButton>
    </template>
  </div>
</template>

<script setup>
import { computed }    from 'vue'
import { useUserStore } from '@/stores/user'
import BaseButton       from './BaseButton.vue'
import SigninButtonMicrosoft from './SigninButtonMicrosoft.vue'

// Google Auth only
import { useGoogleAuth } from '@/api/useGoogleAuth'
const { signInWithGoogle, logout: logoutGoogle } = useGoogleAuth()

const store      = useUserStore()
const isLoggedIn = computed(() => store.isLoggedIn)
const user       = computed(() => store.currentUser)

const userName = computed(() =>
  store.currentUser?.displayName || store.currentUser?.name || 'Utilisateur'
)

async function googleLogin() {
  try {
    await signInWithGoogle()
  } catch (err) {
    console.error('Échec du login Google :', err)
    alert("Impossible de se connecter avec Google.")
  }
}

function logoutAll() {
  if (store.provider === 'google') {
    // c'est Google => on utilise la déconnexion Firebase
    logoutGoogle()
  } else {
    // c'est Microsoft => on clear simplement le profil
    store.clearProfile()
  }
}
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

/* Bouton Microsoft */
.btn-ms {
  --btn-bg: #0078d4;
  --btn-hover-bg: #005a9e;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  font-weight: 500;
  border-radius: 0.25rem;
  background-color: var(--btn-bg);
  transition: background-color 0.2s;
}
.btn-ms:hover {
  background-color: var(--btn-hover-bg);
}

/* Bouton Google */
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

/* Bouton Logout */
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
