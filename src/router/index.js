import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage }
  // tes autres routes…
]

export default createRouter({
  history: createWebHistory(),
  routes
})
