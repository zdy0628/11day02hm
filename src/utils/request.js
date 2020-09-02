// 处理axios发送请求的
import Vue from 'vue'
import axios from 'axios'
import router from '../router'
import { Toast } from 'vant'
// 把axios挂载到原型上
Vue.prototype.$axios = axios
// 给axios配置默认那个baseURL,基准地址
const URL = 'http://localhost:3000'
axios.defaults.baseURL = URL
Vue.prototype.$base = URL
// 给axios配置拦截器
// 请求拦截
axios.interceptors.request.use(function (config) {
  // config指的是请求的信息
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})
// 响应拦截器
axios.interceptors.response.use(function (response) {
  // console.log('拦截到了响应', response)
  const { statusCode, message } = response.data
  if (statusCode === 401 && message === '用户信息验证失败') {
    // console.log('token失效')
    // 跳转到登陆页面
    router.push('/login')
    // 清除失效的信息
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    // 给提示  用户验证失败
    Toast.fail('登陆信息失败')
  }
  return response
})
