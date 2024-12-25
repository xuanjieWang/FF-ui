import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/wx/type/add',
    method: 'post',
    data: data
  })
}

export function deleteById(id) {
  return request({
    url: '/wx/type/' + id,
    method: 'delete'
  })
}

export function update(data) {
  return request({
    url: '/wx/type/update',
    method: 'put',
    data: data
  })
}

export function listType(query) {
  return request({
    url: '/wx/type/list',
    method: 'get',
    params: query
  })
}
