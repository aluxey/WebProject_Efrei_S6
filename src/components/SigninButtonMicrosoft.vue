<!-- src/components/SigninButtonMicrosoft.vue -->
<template>
  <AsyncButton @click="loginMicrosoft" color="primary">
    <template #default>
      <span v-if="user">👋 {{ user.name }}</span>
      <span v-else>Se connecter avec Microsoft</span>
    </template>
  </AsyncButton>
</template>

<script>
import { computed }      from 'vue'
import { PublicClientApplication } from '@azure/msal-browser'
import AsyncButton       from './AsyncButton.vue'
import { useUserStore }  from '../stores/user'

// Initialisation MSAL
const msalConfig = {
  auth: {
    clientId: import.meta.env.VUE_APP_OAUTH_MICROSOFT_CLIENT_ID,
    redirectUri: import.meta.env.VUE_APP_OAUTH_REDIRECT_URI
  }
}
const msalInstance = new PublicClientApplication(msalConfig)
const loginRequest = { scopes: ['User.Read'] }

export default {
  name: 'SigninButtonMicrosoft',
  components: { AsyncButton },
  setup() {
    const store = useUserStore()
    const user  = computed(() => store.currentUser)

    async function loginMicrosoft() {
      const result = await msalInstance.loginPopup(loginRequest)
      const account = result.account
      const profile = {
        name: account.name,
        username: account.username
      }
      store.setProfile(profile)
      return profile
    }

    return { loginMicrosoft, user }
  }
}
</script>
