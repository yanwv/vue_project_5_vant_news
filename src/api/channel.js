// 频道请求
import request from '../utils/request'

//获取所有的频道
export const getAllChannels = () => request({
  method: 'GET',
  url: '/channels'
})

//添加用户频道
export const addUserChannel = (channel) => request({
  method: "POST",
  url: "/user/addChannels",
  data: channel,
})

//删除用户指定频道
export const deleteUserChannel = (channelId, userId) => request({
  method: "DELETE",
  url: "/user/channels",
  data: {
    channelId,
    userId,
  },
});
