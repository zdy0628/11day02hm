import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import User from '../views/User.vue'
import UserEdit from '../views/UserEdit.vue'
import Demo from '../views/Demo.vue'
import MyFollow from '../views/MyFollow.vue'
import MyComment from '../views/MyComment.vue'
import MyStar from '../views/MyStar.vue'

Vue.use(VueRouter)

// 反复跳转到登陆页面解决方法
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  { path: '/login', component: Login, name: 'login' },
  { path: '/register', component: Register, name: 'register' },
  { path: '/user', component: User, name: 'user' },
  { path: '/user-edit', component: UserEdit, name: 'user-edit' },
  { path: '/demo', component: Demo },
  { path: '/myfollow', component: MyFollow, name: 'myfollow' },
  { path: '/mycomment', component: MyComment, name: 'mycomment' },
  { path: '/mystar', component: MyStar, name: 'mystar' }
]

const router = new VueRouter({
  routes
})
// 前置导航守卫
// to：去哪里，from：从哪来，next：函数代表是否放行
// router.beforeEach(function (to, from, next) {
//   if (to.name === 'user') {
//     const token = localStorage.getItem('token')
//     if (token) {
//       next()
//     } else {
//       router.push('/login')
//     }
//   } else {
//     next()
//   }
// })
router.beforeEach(function (to, from, next) {
  const token = localStorage.getItem('token')
  // 需要拦截的所有页面
  const authUrls = ['/user', '/user-edit', '/myfollow', 'mycomment', '/myster']
  if (!authUrls.includes(to.path) || token) {
    next()
  } else {
    router.push('/login')
  }
})

// router.afterEach(function(to, from) {
//   console.log('后置导航守卫执行')
// })

export default router
