import HomePage from '@/pages/home/HomePage.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', component: HomePage, name: 'home' },
  { path: '/sessions/:id', component: HomePage, name: 'sessions.show' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
