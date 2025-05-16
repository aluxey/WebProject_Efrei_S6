<!-- src/components/AuthButtons.vue -->
<template>
  <div class="auth-buttons">
    <template v-if="isLoggedIn">
      <span class="welcome">Bienvenue, {{ user.name }}</span>
      <BaseButton @click="logout" class="btn-logout">
        Déconnexion
      </BaseButton>
    </template>
    <template v-else>
      <SigninButtonMicrosoft class="btn-ms"/>
      <SigninButtonGoogle class="btn-gg"/>
    </template>
  </div>
</template>

<script setup>
import { computed }      from 'vue'
import { useUserStore }  from '../stores/user'
import BaseButton        from './BaseButton.vue'
import SigninButtonMicrosoft from './SigninButtonMicrosoft.vue'
import SigninButtonGoogle    from './SigninButtonGoogle.vue'

const store     = useUserStore()
const user      = computed(() => store.currentUser)
const isLoggedIn = computed(() => store.isLoggedIn)

function logout() {
  store.clearProfile()
}
</script>

<style scoped>
.auth-buttons {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
/* Texte de bienvenue */
.welcome {
  color: #fff;
  font-weight: 500;
  margin-right: 1rem;
}

/* Microsoft bleu */
.btn-ms {
  --btn-bg: #0078d4;
  --btn-hover-bg: #005a9e;
}
/* Google rouge */
.btn-gg {
  --btn-bg: #db4437;
  --btn-hover-bg: #a3332a;
}
/* Bouton déconnexion style ghost */
.btn-logout {
  --btn-bg: transparent;
  --btn-hover-bg: rgba(255,255,255,0.1);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.7);
}
</style>
