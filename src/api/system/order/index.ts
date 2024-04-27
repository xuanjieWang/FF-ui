import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { OrderVO, OrderForm, OrderQuery } from '@/api/system/order/types';

/**
 * 查询【请填写功能名称】列表
 * @param query
 * @returns {*}
 */

export const listOrder = (query?: OrderQuery): AxiosPromise<OrderVO[]> => {
  return request({
    url: '/system/order/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询【请填写功能名称】详细
 * @param id
 */
export const getOrder = (id: string | number): AxiosPromise<OrderVO> => {
  return request({
    url: '/system/order/' + id,
    method: 'get'
  });
};

/**
 * 新增【请填写功能名称】
 * @param data
 */
export const addOrder = (data: OrderForm) => {
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
export const updateOrder = (data: OrderForm) => {
  return request({
    url: '/system/order',
    method: 'put',
    data: data
  });
};

/**
 * 删除【请填写功能名称】
 * @param id
 */
export const delOrder = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/order/' + id,
    method: 'delete'
  });
};