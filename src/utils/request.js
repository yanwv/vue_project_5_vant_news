import axios from 'axios'
import store from '../store'

const request = axios.create({
  baseURL: 'http://localhost:3005/',
})
// 请求拦截器
request.interceptors.request.use(
  function (config) {
    const user = store.state.user
    if (user && user.myToken) {
      config.headers.Authorization = `Bearer ${user.myToken}`
    }
    return config
  },
  function (err) {
    return Promise.reject(err)
  })
// 响应拦截器

export default request