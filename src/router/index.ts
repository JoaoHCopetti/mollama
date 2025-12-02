import { db } from '@/database/db'
import HomePage from '@/pages/home/HomePage.vue'
import { useAppStore } from '@/stores/app-store'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', component: HomePage, name: 'home' },
  { path: '/sessions/:id', component: HomePage, name: 'sessions.show' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.afterEach((to) => {
  if (to.name && ['home', 'sessions.show'].includes(to.name.toString())) {
    handleActiveSession(to)
  }
})

const handleActiveSession = (to: any) =>
  new Promise<void>((resolve) => {
    const appStore = useAppStore()
    const sessionId = to.params?.id

    if (sessionId) {
      db.sessions.get(+sessionId).then((result) => {
        appStore.activeSession = result
        resolve()
      })

      return
    }

    appStore.activeSession = undefined
    resolve()
  })

export default router
