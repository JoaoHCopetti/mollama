import { handleActiveSessionMiddleware } from '@/middlewares/handle-active-session-middleware'
import HomePage from '@/pages/home/HomePage.vue'
import TestPage from '@/pages/TestPage.vue'
import type { MiddlewareFunction } from '@/types'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const globalMiddlewares: MiddlewareFunction[] = [handleActiveSessionMiddleware]

const routes: RouteRecordRaw[] = [
  { path: '/', component: HomePage, name: 'home' },
  { path: '/sessions/:id', component: HomePage, name: 'sessions.show' },
  { path: '/test', component: TestPage, name: 'test.page' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from) => {
  const middlewares = [
    ...globalMiddlewares,
    ...((to?.meta?.middleware as MiddlewareFunction[]) || []),
  ]

  for (const middleware of middlewares) {
    const middlewareResult = await middleware(to, from)

    if (middlewareResult === false || middlewareResult) {
      return middlewareResult
    }
  }
})

export default router
