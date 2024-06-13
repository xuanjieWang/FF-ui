import request from '@/utils/request'

export const getResult = (data) => {
  return request({
    url: '/ali/sms/getResult',
    method: 'post',
    data: data
  })
}
