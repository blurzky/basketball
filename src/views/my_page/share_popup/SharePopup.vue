<template>
  <transition name="loading" appear>
    <div class="pop" @touchmove.prevent>
      <img src="./icon/arrow.png" class="arrow">
      <div class="box">
        <div class="title">点击右上角分享给朋友</div>
        <div class="close_btn" @click="close">关闭</div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'
  @Component
  export default class SharePopup extends Vue {
    @Prop(Boolean) private isShow!: boolean
    protected created(): void {
    }
    private close(): void {
      this.$emit("update:isShow", false);
    }
  }
</script>

<style lang="scss" scoped>
.loading-enter, .loading-leave-active {
  opacity: 0;
}
.pop{
  top: 0;
  left: 0;
  z-index: 99;
  width: 100vw;
  display: flex;
  position: fixed;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  transition: opacity .3s;
  background-color: #00000085;
  .arrow {
    top: 10px;
    right: 40px;
    width: 80px;
    object-fit: cover;
    position: absolute;
  }
  .box {
    color: #fff;
    font-size: 16px;
    text-align: center;
    .title {
      margin-bottom: 20px;
    }
    .close_btn {
      width: 80px;
      margin: 0 auto;
      font-size: 14px;
      line-height: 30px;
      border-radius: 20px;
      border: 1px solid #fff;
    }
  }
}
</style>