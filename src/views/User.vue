<template>
  <div class="user">
    <div class="header" @click="$router.push('/user-edit')">
      <div class="avatar">
        <img :src="base + user.head_img" alt="">
      </div>
      <div class="info">
        <div class="name">
          <span v-if="user.gender === 1" class="iconfont iconxingbienan"></span>
          <span v-else class="iconfont iconxingbienv"></span>
          <span>火星网友</span>
        </div>
        <div class="time">{{user.create_date | time}}</div>
      </div>
      <div class="arrow">
        <span class="iconfont iconjiantou1"></span>
      </div>
    </div>
      <!-- 导航条 -->
      <hm-navitem to="/myfollow">
        <template>我的关注</template>
        <template #content>关注的内容</template>
      </hm-navitem>
      <hm-navitem to="/mycomment">
          <template>我的跟贴</template>
        <template #content>跟贴/回复</template>
      </hm-navitem>
      <hm-navitem>
          <template>我的收藏</template>
        <template #content>文章/视频</template>
      </hm-navitem>
      <hm-navitem to="/user-edit">设置</hm-navitem>
      <div style="margin: 15px;">
        <van-button type="warning" block @click="logout">退出</van-button>
      </div>
  </div>
</template>

<script>
export default {
  computed: {
    base () {
      return this.$axios.defaults.baseURL
    }
  },
  data () {
    return {
      user: ''
    }
  },
  async created () {
    const userId = localStorage.getItem('userId')
    const res = await this.$axios.get(`/user/${userId}`)
    const { statusCode, data } = res.data
    // console.log(res.data)
    if (statusCode === 200) {
      this.user = data
    }
  },
  methods: {
    async logout () {
      try {
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '你确实要退出本系统吗？'
        })
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        this.$router.push('/login')
        this.$toast.success('退出成功')
      } catch {
        this.$toast('取消退出')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.user {
  .header {
    display: flex;
    align-items: center;
    padding: 20px 10px;
    border-bottom: 3px solid #ccc;
    .avatar {
      width: 70px;
      height: 70px;
      img {
        border-radius: 50%;
        width: 100%;
        height: 100%;
      }
    }
    .info {
      flex: 1;
      padding-left: 10px;
      font-size: 14px;
      .time {
        margin-top: 10px;
        color: #666;
      }
      .iconxingbienan {
        color: #7bbcec;
      }
      .iconxingbienv {
        color: pink;
      }
    }
  }
}
</style>
