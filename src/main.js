import { createApp }   from 'vue'
import { createPinia } from 'pinia'
import App             from './App.vue'
import router          from './router'
import Vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App)

app
  .use(createPinia())
  .use(router)
  .use(Vue3GoogleLogin, {
    clientId: import.meta.env.VUE_APP_OAUTH_GOOGLE_CLIENT_ID
  })
  .mount('#app')
