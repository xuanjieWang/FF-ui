import request from '@/utils/request'

/**
 * 查询【请填写功能名称】列表
 * @param query
 * @returns {*}
 */

export const list = (query) => {
  return request({
    url: '/tx/data/list',
    method: 'get',
    params: query
  })
}

export const listDis = (query) => {
  return request({
    url: '/tx/data/listDis',
    method: 'get',
    params: query
  })
}

// 审核
export const adopt = (query) => {
  return request({
    url: '/tx/data/adopt',
    method: 'get',
    params: query
  })
}

// 审核
export const setTx = (data) => {
  return request({
    url: '/tx/data/setTx',
    method: 'post',
    data: data
  })
}

export const getDisOrder = (phoneNumber) => {
  return request({
    url: '/tx/data/getDisOrder/' + phoneNumber,
    method: 'get'
  })
}
