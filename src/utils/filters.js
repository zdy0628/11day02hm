import Vue from 'vue'
import moment from 'moment'
// 配置全局的过滤器
Vue.filter('time', (input, str = 'YYYY-MM-DD') => {
  return moment(input).format(str)
})
