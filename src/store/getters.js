const getters = {
  sidebar: state => state.app.sidebar, // 取App模块属性
  device: state => state.app.device,
  token: state => state.user.token,
  userID: state => state.user.userInfo.userID,
  avatar: state => state.user.avatar,
  name: state => state.user.name
}
// getters便捷访问（state.app.sidebar 变为了 getters.sidebar）
export default getters
