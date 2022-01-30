// 封装用户请求模块

import request from '../utils/request';

export const login = (data) => request({
  method: 'POST',
  url: '/user/login',
  data
})
