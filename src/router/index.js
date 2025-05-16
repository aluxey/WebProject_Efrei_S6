import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import CloudPage from '../pages/CloudPage.vue'
import FlightsPage from '../pages/FlightsPage.vue'
import CustomPage from '../pages/CustomPage.vue'
import HistoryPage from '../pages/HistoryPage.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/flights', name: 'Flights', component: FlightsPage },
  { path: '/cloud', name: 'Clouds', component: CloudPage },
  { path: '/custom', name: 'Custom', component: CustomPage },
  { path: '/history', name: 'History', component: HistoryPage, meta: { requiresAuth: true } },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
