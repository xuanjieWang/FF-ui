import request from '@/utils/request'
export function listNotice(query) {
  return request({
    url: '/system/notice/list',
    method: 'get',
    params: query
  })
}

// 查询公告详细
export function getNotice(noticeId) {
  return request({
    url: '/system/notice/' + noticeId,
    method: 'get'
  })
}

// 获取邀请码

export function getCode(userName) {
  return request({
    url: '/regis/code/' + userName,
    method: 'get'
  })
}
