import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // 路径等同于@/icons/index.js    icons
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
/*
  模拟mock数据
*/
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// 全局注册ElementUI
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

// 注册自定义指令 控制功能权限
Vue.directive('permission', {
  // 会在指令作用的元素插入dom之后执行
  inserted(el, binding) {
    // el是当前指令作用的dom对象
    // binding是v-permission="表达式" 表达式的意思
    // ?是指当该属性为空后，不继续往下读了，直接取值[]，避免报错
    const points = store.state.user.userInfo?.roles?.points || []
    // points是传来的响应数据属性，用来判断按钮显示的权限
    // points中是否有add-employee
    // binding.value: v-permission="表达式" 表达式的值
    if (!points.includes(binding.value)) {
      // 删除或者禁用
      el.remove()
      // el.disabled = true
    }
  }
})

// new Vue({
//   el: '#app',
//   router,
//   store,
//   render: h => h(App)
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
