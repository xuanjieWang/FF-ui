import request from '@/utils/request'
export function getWxImg(type) {
  return request({
    url: '/wx/image/' + type,
    method: 'get'
  })
}
export function addWXImg(data) {
  return request({
    url: '/wx/image/addWXImg',
    method: 'post',
    data: data
  })
}
