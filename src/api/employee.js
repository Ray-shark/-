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

/**
 * 导出员工Excel
 */
export function exprotEmployee() {
  return request({
    url: '/sys/user/export',
    // 改变接受数据的类型，把json改为二进制流
    responseType: 'blob', // 使用blob接收二进制流，此时axios返回的是二进制流，改一下封装的axios（默认接收的json数据）
    timeout: 0 // 提高优先级，这个接口响应时间长，大概12秒。不写的话，封装的axios中会报错超时。或者修改响应报错时间
  })
}
