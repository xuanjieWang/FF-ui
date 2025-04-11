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
    url: '/wx/ppt/add',
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

// 获取img类型数据
export function getFileById(id) {
  return request({
    url: '/wx/ppt/getId/' + id,
    method: 'get',
    params: id
  })
}

// 查询所有的文件种类
export function listFileType() {
  return request({
    url: '/wx/ppt/listFileType',
    method: 'get'
  })
}
