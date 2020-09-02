<template>
  <div class="my-comment">
    <hm-header>我的评论</hm-header>
    <div class="list">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          :immediate-check="false"
          offset="10"
          @load="onLoad"
        >
        <div class="item" v-for="item in commentlist" :key="item.id">
            <div class="time">{{item.create_date | time('YYYY-MM-DD HH:mm')}}</div>
            <div class="comment" v-if="item.parent">
              <div class="name">回复：{{item.parent.user.nickname}}</div>
              <div class="comment_content">{{item.parent.content}}</div>
            </div>
            <div class="content">{{item.content}}</div>
            <div class="origin">
                <span class="one-txt-cur">原文：{{item.post.title}}</span>
                <span class="iconfont iconjiantou1"></span>
            </div>
        </div>
        </van-list>
        </van-pull-refresh>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      commentlist: [],
      // 当前页
      pageIndex: 1,
      // 每页的条数
      pageSize: 6,
      loading: false,
      finished: false,
      // 代表是否正在下拉刷新
      refreshing: false
    }
  },
  created () {
    this.getCommentList()
  },
  methods: {
    async getCommentList () {
      const res = await this.$axios.get('/user_comments', {
        // get请求参数必须放在params中 或 拼接到url地址中
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      // console.log(res.data)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.commentlist = [...this.commentlist, ...data]
        console.log(this.commentlist)

        // 把loading改成false，加载完成了
        this.loading = false

        // 判断如果没有更多数据了，需要把finished 改成 true
        if (data.length < this.pageSize) {
          this.finished = true
        }

        // 结束下拉刷新
        this.refreshing = false
      }
    },
    onLoad () {
      // 加载下一页的数据
      setTimeout(() => {
        this.pageIndex++
        this.getCommentList()
      }, 1000)
    },
    onRefresh () {
    //   console.log('下拉刷新')
      setTimeout(() => {
        this.pageIndex = 1
        this.loading = true
        this.finished = false
        this.commentlist = []
        this.getCommentList()
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  border-bottom: 1px solid #cccccc;
  padding: 10px 20px;
  .item {
    color: #666;
    padding: 10px 0;
  }
  .comment {
    background-color: #dddddd;
    padding: 10px;
    .name {
      color: #666;
      font-size: 14px;
    }
    .comment_content {
      color: #999;
      line-height: 30px;
      margin-top: 10px;
    }
  }
  .content {
    margin: 10px 0;
  }
  .origin {
    font-size: 14px;
    color: #999;
    display: flex;
    justify-content: space-between;
  }
}
</style>
