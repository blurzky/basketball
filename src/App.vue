<template>
<div id="app">
  <transition name="page" mode="out-in">
    <router-view class="container" v-if="status" v-wechat-title="$route.meta.title" />
  </transition>
  <loading v-show="getLoadingStatus" />
</div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  interface UrlQuery {
    userid: string;
    [propName: string]: any;
  }
  @Component
  export default class App extends Vue {
    protected status: boolean = false;
    protected setQuery(code: string) { 
      var reg = new RegExp(`(^|\\?|&)${code}=([^&]*)(\\s|&|$)`, "i");
      return reg.test(location.href) ? unescape(RegExp.$2.replace(/\+/g, " ")) : "";
    }
    get getLoadingStatus(): boolean {
      return this.$store.state.loadingStatus;
    }
    protected async created(): Promise<any> {
      this.$store.commit('setPhone');
      if (location.href.includes('code')) {
        const code = this.setQuery('code');
        try {
          const { userid } = await this.$api({
            url: '/beeagleUsers/findByGoid',
            data: {
              code,
              owner: this.$route.query.owner || '',
              invite_user: this.$route.query.inviteUser || 0
            }
          });
          this.$toast.success('登录成功')
          this.$store.commit('saveUserid', userid);
          this.$wxShare({
            title: '比高篮球',
            desc: '报名体验课',
            link: `https://bigaowx.tanjie.club/test_class?inviteUser=${userid}`,
            imgUrl: 'https://static.tanjie.shop/beeagle/logo.png'
          });
          this.status = true;
        } catch (error) {
          this.$toast(`${error || '登录失败，请稍后重试'}`);
        }
      } else {
        this.status = true;
      }
    }
  }
</script>


<style lang="scss">
  .container {
    display: flex;
    min-height: 100vh;
    align-items: center;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: flex-start;
    .page {
      flex: 1;
      width: 100%;
      box-sizing: border-box;
      background-color: #ececec;
    }
  }
  .page-enter {
    opacity: 0;
  }
  .page-leave {
    opacity: 1;
  }
  .page-enter-active {
    transition: opacity .3s;
  }
  .page-leave-active {
    opacity: 0;
    transition: opacity .3s;
  }
  #app {
    color: #333;
    margin: 0 auto;
    font-size: 12px;
    font-weight: 400;
    max-width: 540px;
    background-color: #fff;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;
  }
  textarea,
  input {
    @include set_input_placeholder;
    font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;
  }
  html, body, div, p, ul, ol, li, a, span, i, img, video, input, textarea {
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
  }
</style>
