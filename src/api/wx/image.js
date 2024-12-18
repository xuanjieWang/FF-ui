import request from '@/utils/request'
export function getWxImg(type) {
  return request({
    url: '/wx/image/' + type,
    method: 'get'
  })
}
