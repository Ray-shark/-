import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo } from '@/api/user'

// 作数据存放
const state = {
  token: getToken(), // 从缓存中读取初始值token，该模块已经封装了基于cookie的缓存工具
  userInfo: {} // 用于存储用户基本资料状态（数据）
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
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  }
}

// 作异步操作
const actions = {
  // context上下文，传入参数
  async login(context, data) {
    // console.log(data)
    // todo：调用登录接口
    try {
      // 返回一个token
      const token = await login(data)
      context.commit('setToken', token)
    } catch (error) {
      console.log('登录失败', error) // 处理Promise.reject(error)
    }
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    context.commit('setUserInfo', result)
  },
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 清除用户信息
    context.commit('setUserInfo', {})
  }
}

export default {
  namespaced: true, // 开启命名空间（调用下面的state，mutation，action时必须带上模块名称user）
  state,
  mutations,
  actions
}
