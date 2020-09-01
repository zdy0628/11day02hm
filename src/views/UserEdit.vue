<template>
  <div class="user-edit">
    <hm-header>编辑资料</hm-header>
  <!-- 头像 -->
   <div class="avatar">
      <img :src="$axios.defaults.baseURL + user.head_img" alt="">
      <van-uploader :after-read="afterRead" />
   </div>
  <!-- 导航 -->
  <hm-navitem @click="showNickname">
      <template>昵称</template>
      <template #content>{{user.nickname}}</template>
  </hm-navitem>
  <hm-navitem @click="showPassword">
      <template>密码</template>
      <template #content>******</template>
  </hm-navitem>
  <hm-navitem @click="ShowGender">
      <template>性别</template>
      <template #content>{{user.gender === 1?'男':'女'}}</template>
  </hm-navitem>
  <!-- 渲染dialog组件 -->
  <van-dialog v-model="isShowNickname" title="编辑昵称" show-cancel-button
  @confirm="updateNickname">
    <van-field v-model="nickname" ref="nickname" placeholder="请输入用户名" />
  </van-dialog>
  <van-dialog v-model="isShowPassword" title="修改密码" show-cancel-button
  @confirm="updatePassword">
    <van-field v-model="password" placeholder="请输入密码" />
  </van-dialog>
  <van-dialog v-model="isShowGender" title="修改性别" show-cancel-button
  @confirm="updatGender">
    <!-- <van-radio-group v-model="gender">
      <van-radio :name="1">男</van-radio>
      <van-radio :name="0">女</van-radio>
    </van-radio-group> -->
    <van-radio-group v-model="gender">
        <van-cell-group>
          <van-cell title="男" clickable @click="gender = 1">
            <template #right-icon>
              <van-radio :name="1" />
            </template>
          </van-cell>
          <van-cell title="女" clickable @click="gender = 0">
            <template #right-icon>
              <van-radio :name="0" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
  </van-dialog>

  <!-- 裁剪的模态框  -->
  <div class="mask" v-show="isShowMask">
    <Van-button type="primary" class="crop" @click="crop">裁剪</Van-button>
    <Van-button type="danger" class="cancel" @click="isShowMask = false">取消</Van-button>
    <VueCropper
    ref="aa"
    :img="img"
    autoCrop
    autoCropWidth="100"
    autoCropHeight="100"
    fixed
    ></VueCropper>
  </div>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
export default {
  components: {
    VueCropper
  },
  data () {
    return {
      user: '',
      isShowNickname: false,
      nickname: '',
      isShowPassword: false,
      password: '',
      isShowGender: false,
      gender: 0,
      // 是否显示裁剪框
      isShowMask: false,
      img: ''
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo () {
      const userId = localStorage.getItem('userId')
      const res = await this.$axios.get(`/user/${userId}`)
      console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.user = data
      }
    },
    async showNickname () {
      this.isShowNickname = true
      this.nickname = this.user.nickname
      // 等待DOM的更新
      await this.$nextTick()
      // 需要自动获取焦点
      this.$refs.nickname.focus()
    },
    async updatUser (data) {
      // console.log('123')
      const userId = localStorage.getItem('userId')
      const res = await this.$axios.post(`/user_update/${userId}`, data)
      // console.log(res.data)
      if (res.data.statusCode === 200) {
        this.getUserInfo()
        this.$toast.success('修改成功')
      }
    },
    async updateNickname () {
      // console.log('123')
      // const userId = localStorage.getItem('userId')
      // const res = await this.$axios.post(`/user_update/${userId}`, {
      //   nickname: this.nickname
      // })
      // // console.log(res.data)
      // if (res.data.statusCode === 200) {
      //   this.getUserInfo()
      //   this.$toast.success('修改成功')
      // }
      this.updatUser({ nickname: this.nickname })
    },
    showPassword () {
      this.isShowPassword = true
      this.password = this.user.password
    },
    async updatePassword () {
      // const userId = localStorage.getItem('userId')
      // const res = await this.$axios.post(`/user_update/${userId}`, {
      //   password: this.password
      // })
      // if (res.data.statusCode === 200) {
      //   this.getUserInfo()
      //   this.$toast.success('修改成功')
      // }
      this.updatUser({ password: this.password })
    },
    ShowGender () {
      this.isShowGender = true
      this.gender = this.user.gender
    },
    updatGender () {
      this.updatUser({ gender: this.gender })
    },
    isImg (name) {
      if (name.endsWith('.gif') || name.endsWith('.jpg') || name.endsWith('.png') || name.endsWith('.jpeg')) {
        return true
      } else {
        return false
      }
    },
    afterRead (file) {
      // 校验图片的类型和大小，满足才上传，不满足，给一个提示
      if (!this.isImg(file.file.name)) {
        return this.$toast.fail('请上传正确的图片')
      }
      if (file.file.size >= 50 * 1024) {
        return this.$toast.fail('上传图片太大')
      }
      // 显示裁剪框
      this.isShowMask = true
      // 设置裁剪的图片
      this.img = file.content
    },
    crop () {
      this.$refs.aa.getCropBlob(async blob => {
        // console.log(data)
        // 此时可以自行将文件上传至服务器  file.file
        // 发送请求，上传文件 （必须是formData对象）
        // 创建一个空的formData对象
        const fd = new FormData()
        // 给formData对象添加上传的对象
        fd.append('file', blob)
        const res = await this.$axios.post('/upload', fd)
        // console.log(file)
        const { statusCode, data } = res.data
        if (statusCode === 200) {
          console.log(data.url)
          // 修改用户头像
          this.updatUser({
            head_img: data.url
          })
        }
        // 隐藏裁剪框
        this.isShowMask = false
      })
    }
  }

}
</script>

<style lang="less" scoped>
.avatar {
  padding: 40px 0;
  text-align: center;
  position: relative;
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .van-uploader {
    position: absolute;
    left: 50%;
    top: 40px;
    transform: translate(-50%);
    width: 100px;
    height: 100px;
    opacity: 0;
  }
}
/deep/ .van-dialog__content {
  padding: 15px;
  .van-field {
    border: 1px solid #ccc;
  }
}
.mask {
  width: 100%;
  height: 100%;
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  .crop,
  .cancel {
    position: fixed;
    top: 0;
    z-index: 1;
  }
  .cancel {
    right: 0;
  }
}
</style>
