import {getToken, setToken, removeToken} from "@/utils/auth";

const state = {
  token: getToken()
}

const mutation = {
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  removeToken() {
    state.token = null
    removeToken()
  }
}

const action = {
  login(context, data) {
    // 调用接口

    context.commit('setToken', '123456')
  }
}

export default {
  namespaced: true,
  state,
  mutation,
  action
}
