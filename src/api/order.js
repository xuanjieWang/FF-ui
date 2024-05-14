import request from '@/utils/request';

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
  });
};

export const listHis = (query) => {
  return request({
    url: '/system/order/listHis',
    method: 'get',
    params: query
  });
};
/**
 * 查询【请填写功能名称】详细
 * @param id
 */
export const getOrder = (id) => {
  return request({
    url: '/system/order/' + id,
    method: 'get'
  });
};

/**
 * 新增【请填写功能名称】
 * @param data
 */
export const addOrder = (data) => {
  return request({
    url: '/system/order',
    method: 'post',
    data: data
  });
};

/**
 * 修改【请填写功能名称】
 * @param data
 */
export const updateOrder = (data) => {
  return request({
    url: '/system/order',
    method: 'put',
    data: data
  });
};

export const subComm = (data) => {
  return request({
    url: '/system/order/subcomm',
    method: 'put',
    data: data
  });
};

/**
 * 删除【请填写功能名称】
 * @param id
 */
export const delOrder = (id) => {
  return request({
    url: '/system/order/' + id,
    method: 'delete'
  });
};
