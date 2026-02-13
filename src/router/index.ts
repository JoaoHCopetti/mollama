import { ensureAppIsReady } from '@/middlewares/ensure-app-is-ready'
import { handleActiveSessionMiddleware } from '@/middlewares/handle-active-session-middleware'
import HomePage from '@/pages/home/HomePage.vue'
import SetupProviderPage from '@/pages/setup-provider/SetupProviderPage.vue'
import TestPage from '@/pages/TestPage.vue'
import type { MiddlewareFunction } from '@/types'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const globalMiddlewares: MiddlewareFunction[] = [handleActiveSessionMiddleware]

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: HomePage,
    name: 'home',
    meta: {
      middleware: [ensureAppIsReady],
    },
  },
  { path: '/sessions/:id', component: HomePage, name: 'sessions.show' },
  { path: '/setup', component: SetupProviderPage, name: 'setup' },
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
