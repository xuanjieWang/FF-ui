import request from '@/utils/request'

// 获取交易分析数据 - 统一接口
export const getTransactionAnalysis = (timeType) => {
  return request({
    url: '/account/data/analysis/' + timeType,
    method: 'get'
  })
}
