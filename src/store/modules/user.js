import { getToken, setToken, removeToken } from '@/utils/auth'

// 作数据存放
const state = {
  token: getToken() // 从缓存中读取初始值token，该模块已经封装了基于cookie的缓存工具
}

// 作修改数据
const mutations = {
  setToken(state, token) {
    state.token = token
    // 同步到缓存,该模块已经封装了基于cookie的缓存工具，在auth.js中查看
    setToken(token)
  },
  removeToken() {
    // 删除vuex的token
    state.token = null
    // 此处是用的工具auth.js中的删除缓存的方法，不是mutation中的
    removeToken()
  }
}

// 作异步操作
const actions = {
  // context上下文，传入参数
  login(context, data) {
    console.log(data)
    // todo：调用登录接口
    // 返回一个token 123456
    context.commit('setToken', '123456')
  }
}

export default {
  namespaced: true, // 开启命名空间（调用下面的state，mutation，action时必须带上模块名称user）
  state,
  mutations,
  actions
}
