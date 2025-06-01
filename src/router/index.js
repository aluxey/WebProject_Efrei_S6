import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import HomePage    from '../pages/HomePage.vue'
import FlightsPage from '../pages/FlightsPage.vue'
import CloudPage   from '../pages/CloudPage.vue'
import CustomPage  from '../pages/CustomPage.vue'
import HistoryPage from '../pages/HistoryPage.vue'
import EnergyPage  from '../pages/EnergyPage.vue'
import ProductPage from '../pages/ProductFootprintPage.vue'
import FreightPage from '../pages/FreightPage.vue'
import ProcurementPage from '../pages/ProcurementPage.vue'

const routes = [
  { path: '/',        name: 'Home',    component: HomePage },
  { path: '/flights', name: 'Flights', component: FlightsPage },
  { path: '/cloud',   name: 'Clouds',  component: CloudPage },
  { path: '/custom',  name: 'Custom',  component: CustomPage },

  // Only visible/accessible once logged in:
  {
    path: '/history',
    name: 'History',
    component: HistoryPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/energy',
    name: 'Energy',
    component: EnergyPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/product',
    name: 'Product',
    component: ProductPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/freight',
    name: 'Freight',
    component: FreightPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/procurement',
    name: 'Procurement',
    component: ProcurementPage,
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
