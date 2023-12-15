import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
import { asyncRoutes } from '@/router'

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
        // 解构用户信息中的roles属性
        const { roles } = await store.dispatch('user/getUserInfo')
        // console.log(roles.menus) // 角色拥有权限的数组 数量不确定
        // console.log(asyncRoutes) // 动态路由的数组（所有权限） 8个
        const filterRoutes = asyncRoutes.filter(item => {
          return roles.menus.includes(item.name) // return true/false
        }) // 筛选后的路由
        // 404页面必须在所有页面的最后（routes数组的最后）
        router.addRoutes([...filterRoutes, { path: '*', redirect: '/404', hidden: true }]) // 添加动态路由信息到路由表
        // router添加动态路由之后，需要转发一下(往目标地址再跳一次)
        next(to.path) // 目的是让路由拥有信息 router的已知缺陷，不能直接放过next
      } else {
        next() // 放过
      }
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
