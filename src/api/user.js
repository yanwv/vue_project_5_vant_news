import request from '../utils/request';
import store from '../store'

// 封装用户请求模块
export const login = (data) => request({
  method: 'POST',
  url: '/user/login',
  data
})

// 获取用户信息
export const getUserInfo = (id) => request({
  method: 'GET',
  url: '/userInfo/get',
  params: { userId: id },
  // headers: {
  //   Authorization: `Bearer ${store.state.user.myToken}`
  // }
})

// 获取用户频道列表
export const getUserChannels = () => request({
  method: 'GET',
  url: '/user/channels'
})
export const getCurrentChannels = (id) => request({
  method: "GET",
  url: "/user/currentChannels",
  params: { userId: id },
});
