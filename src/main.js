import { createApp }     from 'vue'
import { createPinia }   from 'pinia'
import App               from './App.vue'
import router            from './router'
import Vue3GoogleLogin   from 'vue3-google-login'
import { library }       from '@fortawesome/fontawesome-svg-core'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'leaflet/dist/leaflet.css'       // ← importer la CSS Leaflet **ici**, globalement
import './assets/style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

library.add(faCircleNotch)

const app = createApp(App)
app
  .use(createPinia())
  .use(router)
  .use(Vue3GoogleLogin, { clientId: import.meta.env.VITE_OAUTH_GOOGLE_CLIENT_ID })
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
