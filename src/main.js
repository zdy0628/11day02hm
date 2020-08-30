import Vue from 'vue'
import App from './App.vue'
import router from './router'
import moment from 'moment'
// 导入通用的样式
import './styles/base.less'
import './styles/iconfont.css'
// 导入vant
import Vant, { Toast } from 'vant'
import 'vant/lib/index.css'
// 导入amfe-flexible库
import 'amfe-flexible'
import HmHeader from './components/HmHeader.vue'
import HmLogo from './components/HmLogo.vue'
import axios from 'axios'
import HmNavItem from './components/HmNavitem.vue'

// 把axios挂载到原型上
Vue.prototype.$axios = axios
// 给axios配置默认那个baseURL,基准地址
axios.defaults.baseURL = 'http://localhost:3000'

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
  console.log('拦截到了响应', response)
  const { statusCode, message } = response.data
  if (statusCode === 401 && message === '用户信息验证失败') {
    console.log('token失效')
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
// 全局注册组件
Vue.component('hm-header', HmHeader)
Vue.component('hm-logo', HmLogo)
Vue.component('hm-navitem', HmNavItem)

Vue.filter('time', input => {
  return moment(input).format('YYYY-MM-DD')
})

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
