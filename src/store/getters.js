const getters = {
  sidebar: state => state.app.sidebar, // 取App模块属性
  device: state => state.app.device,
  token: state => state.user.token,
  userId: state => state.user.userInfo.userId,
  avatar: state => state.user.userInfo.staffPhoto, // 头像
  name: state => state.user.userInfo.username, // 用户名称
  routes: state => state.user.routes
}
// getters便捷访问（state.app.sidebar 变为了 getters.sidebar）
export default getters
