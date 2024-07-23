import request from '@/utils/request'
import { data } from 'autoprefixer'

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
export const adopt = (data) => {
  return request({
    url: '/tx/data/adopt',
    method: 'post',
    data: data
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

export const getDisOrder = (data) => {
  return request({
    url: '/tx/data/getDisOrderList',
    method: 'post',
    data: data
  })
}
