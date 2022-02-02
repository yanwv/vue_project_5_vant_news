// 文章请求
import request from '../utils/request'
export const getArticles = (params) => request({
  method: 'GET',
  url: '/articles',
  params
})