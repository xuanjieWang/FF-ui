import request from '@/utils/request';

export const listAccount = (query) => {
  return request({
    url: '/account/data/listAccount',
    method: 'get',
    params: query
  });
};
