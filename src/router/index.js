import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import HomePage    from '../pages/HomePage.vue'
import FlightsPage from '../pages/FlightsPage.vue'
import CloudPage   from '../pages/CloudPage.vue'
import EnergyPage  from '../pages/EnergyPage.vue'
import FreightPage from '../pages/FreightPage.vue'

const routes = [
  { path: '/',        name: 'Home',    component: HomePage },
  { path: '/flights', name: 'Flights', component: FlightsPage },
  { path: '/cloud',   name: 'Clouds',  component: CloudPage },

 ,
  {
    path: '/energy',
    name: 'Energy',
    component: EnergyPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/freight',
    name: 'Freight',
    component: FreightPage,
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return next({ name: 'Home' })
  }
  next()
})

export default router
