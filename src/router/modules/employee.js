import layout from '@/layout'
export default {
  path: '/employee',
  name: 'employee',
  component: layout,
  children: [{
    path: '',
    name: 'employee',
    component: () => import('@/views/employee'),
    meta: {
      title: '员工',
      icon: 'people'
    }
  }, {
    path: '/employee/detail/:id?', // 员工详情的地址 原路由：/employee/detail  动态路由：在原路由的基础上加上/  :id是给后面的参数取名  ?表示可以有id也可以没有
    component: () => import('@/views/employee/detail'),
    hidden: true, // 表示隐藏在左侧菜单(不显示该二级路由导航)
    meta: {
      title: '员工详情'
    }
  }]
}

// 只想在左侧导航菜单显示一级菜单：让二级路由只有一个显示在左侧菜单
