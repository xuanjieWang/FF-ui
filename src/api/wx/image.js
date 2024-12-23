import request from '@/utils/request'
export function getWxImg(type) {
  return request({
    url: '/wx/image/' + type,
    method: 'get'
  })
}
export function addWXImg(data) {
  return request({
    url: '/wx/image/add',
    method: 'post',
    data: data
  })
}

export function updateImageList(data) {
  return request({
    url: '/wx/image/updateImageList',
    method: 'post',
    data: data
  })
}
