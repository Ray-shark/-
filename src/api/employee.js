import request from '@/utils/request'

/**
 * 获取员工列表
 */
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params // 地址参数 查询参数（最终会拼接到url地址后面） ***有请求体时用data参数***
  })
}
