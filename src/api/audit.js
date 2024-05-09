import request from '@/utils/request';

// 提交实名信息信息
export function addRealInfo(data) {
  return request({
    url: '/Audit/data/addRealInfo',
    method: 'post',
    data: data
  });
}

// 审核按钮
export function handleAudit(data) {
  return request({
    url: '/Audit/data/audit',
    method: 'post',
    data: data
  });
}

//重新审核
export function resetAudit(id) {
  return request({
    url: '/Audit/data/resetAudit/' + id,
    method: 'get'
  });
}

//获取审核列表
export function getAuditList(id) {
  return request({
    url: '/Audit/data/getList/' + id,
    method: 'get'
  });
}
