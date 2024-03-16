import type { Router } from 'vue-router'

// import { useUserStore } from '@/stores/user'

const AUTH_WHITE_LIST = ['/', '/user/login', '/user/[uid]']

export function useUserAuth(router: Router) {
  router.beforeEach((to, _, next) => {
    // 如果访问了路由白名单，直接放行
    if (AUTH_WHITE_LIST.includes(to.name as string)) {
      next()
      return
    }

    // 如果没有 uid
    // const userStore = useUserStore()
    // if (!userStore.account?.uid) {
    //   next(`/user/login?redirect=${to.path}`)
    //   useToastError('请先登录')
    //   return
    // }

    next()
  })
}
