<template>
  <div class="demo">
    <van-button type="primary" @click="crop"></van-button>
    <!-- autoCrop生成裁剪框
    fixed：固定裁剪框的宽高
    -->
    <vue-cropper
    ref="cropper"
    fixed
    autoCrop
    autoCropWidth="150"
    autoCropHeight="150"
    ></vue-cropper>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
export default {
  components: {
    VueCropper
  },
  methods: {
    crop () {
      this.$refs.cropper.getCropData(data => {
        console.log(data)
      })
      this.$refs.cropper.getCropBlob(data => {
        console.log(data)
      })
    }
  }
}

</script>

<style lang="less" scoped>
.demo {
  width: 100%;
  height: 100%;
  position: fixed;
}

</style>
