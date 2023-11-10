import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'

const whiteList = ['/login', '/404']

// 前置守卫
router.beforeEach(async(to, from, next) => {
  // 开启进度条
  nprogress.start()
  // 查看是否有token
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/') // 跳转到该路径
      nprogress.done() // 跳转路由后不会走后置守卫，需要手动关闭进度条
    } else {
      // 判断是否获取过用户资料
      if (!store.getters.userID) {
        await store.dispatch('user/getUserInfo')
      }
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      nprogress.done()
    }
  }
})

// 后置守卫
router.afterEach(() => {
  nprogress.done()
})
