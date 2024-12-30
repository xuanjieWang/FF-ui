import request from '@/utils/request'

export function listType(type) {
  return request({
    url: '/wx/ppt/' + type,
    method: 'get'
  })
}

export function listData(query) {
  return request({
    url: '/wx/ppt/list',
    method: 'get',
    params: query
  })
}

export function addPPTFile(data) {
  return request({
    url: '/wx/upload/upload',
    method: 'post',
    data: data
  })
}

export function deleteById(id) {
  return request({
    url: '/wx/ppt/' + id,
    method: 'delete'
  })
}

export function update(data) {
  return request({
    url: '/wx/ppt/update',
    method: 'put',
    data: data
  })
}
