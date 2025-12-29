import { db } from '@/database/db'
import HomePage from '@/pages/home/HomePage.vue'
import TestPage from '@/pages/TestPage.vue'
import { useAppStore } from '@/stores/app-store'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', component: HomePage, name: 'home' },
  { path: '/sessions/:id', component: HomePage, name: 'sessions.show' },
  { path: '/test', component: TestPage, name: 'test.page' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const appStore = useAppStore()

  const sessionId = to.params.id

  if (sessionId) {
    db.sessions.get(+sessionId).then((result) => {
      appStore.activeSession = result
    })
    return
  }

  appStore.activeSession = null
})

export default router
