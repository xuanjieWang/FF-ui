import request from '@/utils/request'

/**
 * 查询【请填写功能名称】列表
 * @param query
 * @returns {*}
 */

export const listOrder = (query) => {
  return request({
    url: '/system/order/list',
    method: 'get',
    params: query
  })
}

export const listHis = (query) => {
  return request({
    url: '/system/order/listHis',
    method: 'get',
    params: query
  })
}
export const getOrder = (id) => {
  return request({
    url: '/system/order/' + id,
    method: 'get'
  })
}

export const addOrder = (data) => {
  return request({
    url: '/system/order',
    method: 'post',
    data: data
  })
}

export const updateOrder = (data) => {
  return request({
    url: '/system/order',
    method: 'put',
    data: data
  })
}

export const delOrder = (id) => {
  return request({
    url: '/system/order/' + id,
    method: 'delete'
  })
}

/**
 * 搜索用户
 */
export const searchUser = (query) => {
  return request({
    url: '/system/user/searchUser',
    method: 'get',
    params: query
  })
}

/**
 * 提现时间
 */
export const getTxTime = () => {
  return request({
    url: '/system/money/getTime',
    method: 'get'
  })
}

/**
 * 提现时间
 */
export const setTxTime = (data) => {
  return request({
    url: '/system/money/setTxTime',
    method: 'get',
    params: data
  })
}

// 提现订单
export const getTxOrder = (data) => {
  return request({
    url: '/system/order/getTxOrder',
    method: 'post',
    data: data
  })
}
