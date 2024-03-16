import { createRouter, createWebHashHistory } from 'vue-router'
import generatedRoutes from 'virtual:generated-pages'

import { useViewTransition } from './plugins/view-transition'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: generatedRoutes,
})

useViewTransition(router)

export default router
