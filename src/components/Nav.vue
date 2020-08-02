<template>
  <div
    class="nav_wrapper"
    :style="{
      height: `${height + paddingTop}px`
    }">
    <div
      class="nav"
      :style="{
        height: `${height}px`,
        paddingTop: `${paddingTop}px`,
        color: color || getDefaultColor,
        backgroundColor: backgroundColor || getDefaultBackgroundColor
      }">
      <div class="left" @click="goBack">
        <img v-if="leftIcon" :src="backIcon">
      </div>
      <div class="title">{{title}}</div>
      <div class="right" @click="(rightIcon || rightTitle) && $emit('ck')">
        <img v-if="rightIcon" :src="rightIcon">
        <span v-if="rightTitle">{{rightTitle}}</span>
      </div>
      <div
        class="boder_bottom"
        :style="{
          borderBottomColor: borderColor || backgroundColor || getDefaultBackgroundColor
        }"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'
  @Component
  export default class Nav extends Vue {
    // 右侧回调事件名 => ck
    // type可选值 dark, light；默认值light；黑，白两种预设导航栏
    // replace push则替换返回事件
    @Prop(String) protected title!: string;
    @Prop(String) protected rightTitle?: string;
    @Prop() protected leftIcon?: any;
    @Prop() protected rightIcon?: any;
    @Prop(String) protected color?: string;
    @Prop(String) protected borderColor?: string;
    @Prop(String) protected backgroundColor?: string;
    @Prop({type: String, default: 'light'}) protected type?: string;
    @Prop(String) protected replace?: string;
    @Prop(String) protected push?: string;
    protected backIcon?: any = require('../assets/img/dark_arrow.png');
    protected goBack(): void {
      const index = this.$route.meta.index;
      if (index) {
        if (this.push) {
          this.$router.push(this.push);
        } else if (this.replace) {
          this.$router.replace(this.replace);
        } else {
          this.$router.go(-1);
        }
      } else {
        if (this.$store.state.phone === 1) {
          Android.goBack();
        } else {
          window.open('https://wx.tanjie.wang/goBack', '_self');
        }
      }
    }
    get getDefaultColor(): string {
      return this.color || (this.type === 'light' ? '#333' : '#fff');
    }
    get getDefaultBackgroundColor(): string {
      return this.backgroundColor || (this.type === 'light' ? '#fff' : '#333');
    }
    get height(): number {
      return this.$store.state.phone === 1 ? 39 : 44;
    }
    get paddingTop(): number {
      let top: number = 25;
      switch (this.$store.state.phone) {
        case 1:
          top = 25;
          break;
        case 2:
          top = 44;
          break;
        case 3:
          top = 20;
          break;
        default:
          break;
      }
      return top;
    }
  }
</script>

<style lang="scss" scoped>
  .nav_wrapper {
    width: 100%;
    .nav {
      .boder_bottom {
        left: 0;
        bottom: 0;
        z-index: 1;
        content: '';
        width: 100%;
        position: absolute;
        pointer-events: none;
        box-sizing: border-box;
        transform: scale(1, .5);
        transform-origin: 0 100%;
        border-bottom-width: 1px;
        border-bottom-style: solid;
      }
      .title {
        flex: 1;
        font-size: 16px;
        text-align: center;
      }
      .right {
        padding-right: 12px;
        justify-content: flex-end;
      }
      .left {
        padding-left: 12px;
        justify-content: flex-start;
      }
      .left, .right {
        width: 70px;
        height: 100%;
        display: flex;
        align-items: center;
        &>img {
          width: 22px;
        }
        &>span {
          font-size: 14px;
        }
      }
      top: 0;
      left: 0;
      width: 100%;
      z-index: 100;
      display: flex;
      position: fixed;
      font-weight: 500;
      align-items: center;
      justify-content: flex-start;
      transition: background-color .3s linear, color .3s linear;
    }
  }
</style>
