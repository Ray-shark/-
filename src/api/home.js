import request from '@/utils/request'

/**
 * 获取首页数据
 * @returns {*}
 */
export function getHomeData() {
  return request({
    url: '/home/data'
  })
}

/**
 * 获取首页消息列表
 */
export function getMessageList() {
  return request({
    url: '/home/notice'
  })
}
