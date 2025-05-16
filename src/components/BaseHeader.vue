<template>
  <header class="base-header">
    <nav>
      <RouterLink to="/" class="nav-link">Home</RouterLink>

      <RouterLink v-if="isLoggedIn" to="/conversations" class="nav-link">
        Conversations
      </RouterLink>

      <span class="spacer"></span>

      <div class="auth-buttons">
        <span v-if="isLoggedIn">{{ user.name }}</span>
        <template v-else>
          <SigninButtonMicrosoft class="btn-signin" />
          <SigninButtonGoogle    class="btn-signin" />
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed }      from 'vue'
import { useUserStore }  from '../stores/user'
import { RouterLink }    from 'vue-router'
import SigninButtonMicrosoft from './SigninButtonMicrosoft.vue'
import SigninButtonGoogle    from './SigninButtonGoogle.vue'

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)
const user       = computed(() => userStore.currentUser)
</script>

<style scoped>
.base-header {
  background: #42b983;
  padding: 0.5rem 1rem;
  color: white;
}
nav {
  display: flex;
  align-items: center;
}
.nav-link {
  margin-right: 1rem;
  color: white;
  text-decoration: none;
}
.spacer {
  flex: 1;
}
.auth-buttons {
  display: flex;
  gap: 0.5rem;
}
.btn-signin {
  font-size: 0.9rem;
  padding: 0.3rem 0.6rem;
}
</style>
