import { createApp }     from 'vue'
import { createPinia }   from 'pinia'
import App               from './App.vue'
import router            from './router'
import Vue3GoogleLogin   from 'vue3-google-login'
import { library }       from '@fortawesome/fontawesome-svg-core'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCircleNotch)

const app = createApp(App)
app
  .use(createPinia())
  .use(router)
  .use(Vue3GoogleLogin, { clientId: import.meta.env.VITE_OAUTH_GOOGLE_CLIENT_ID })
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
