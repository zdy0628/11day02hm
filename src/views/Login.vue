<template>
  <div>
   <hm-header>登陆</hm-header>
   <hm-logo></hm-logo>
   <van-form @submit="login">
  <van-field
    v-model="username"
    name="用户名"
    label="账号"
    placeholder="请输入用户名"
    :rules="rules.username"
  />
  <van-field
    v-model="password"
    type="password"
    name="密码"
    label="密码"
    placeholder="请输入密码"
    :rules="rules.password"
  />
  <div style="margin: 16px;">
    <van-button  block type="info" native-type="submit">
      登陆
    </van-button>

    <p class="tips">没有账号？去<router-link to="/register">注册</router-link></p>
  </div>
</van-form>
  </div>
</template>

<script>
export default {
  created () {
    // console.log(this.$route)
    const { username, password } = this.$route.query
    this.username = username
    this.password = password
  },
  methods: {
    async login () {
      const res = await this.$axios.post('/login', {
        username: this.username,
        password: this.password
      })
      const { statusCode, message, data } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        // 保存token
        localStorage.setItem('token', data.token)
        localStorage.setItem('userId', data.user.id)
        // 跳转到个人中心
        this.$router.push({
          path: '/user'
        })
      } else {
        this.$toast.fail(message)
      }
    }
  },
  data () {
    return {
      username: '',
      password: '',
      rules: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'onChange' },
          { pattern: /^\d{5,11}$/, message: '用户名长度5-11位', trigger: 'onChange' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'onChange' },
          { pattern: /^\d{3,9}$/, message: '密码长度3-9位', trigger: 'onChange' }
        ]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tips {
  padding: 15px;
  font-size: 16px;
  text-align: right;
  a {
    color: orange;
  }
}
</style>
