import request from '@/utils/request'

// 文件分片上传
export function uploadFile(data) {
  return request({
    url: '/wx/upload/upload',
    method: 'post',
    data: data
  })
}
