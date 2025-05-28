<template>
  <AsyncButton @click="loginMicrosoft" color="primary">
    <template #default>
      <span v-if="user">👋 {{ user.name }}</span>
      <span v-else>Se connecter avec Microsoft</span>
    </template>
  </AsyncButton>
</template>

<script setup>
import { computed }                   from 'vue'
import AsyncButton                    from './AsyncButton.vue'
import { msalInstance, loginRequest } from '../api/msal'
import { useUserStore }               from '../stores/user'

const store = useUserStore()
const user  = computed(() => store.currentUser)

async function loginMicrosoft() {
  try {
    await msalInstance.initialize()
    // popup
    const authResult = await msalInstance.loginPopup(loginRequest)
    const acct       = authResult.account|| msalInstance.getAllAccounts()[0]

    const profile = { name: acct.name, username: acct.username }
    store.setProfile(profile)
    return profile

  } catch (err) {
    if (err.errorCode === 'interaction_in_progress') return
    console.error('MSAL login failed', err)
    throw err
  }
}
</script>
