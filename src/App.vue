<template>
<div id="app">
  <transition name="page" mode="out-in">
    <router-view class="container" v-if="status" />
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
    protected query: UrlQuery = null;
    protected getUrlQuery(): UrlQuery {
      const obj: UrlQuery = {
        userid: ''
      };
      let str: string | string[] = window.location.search;
      if (str) {
        str = str.replace('?', '&');
        str = str.split('&');
        str.forEach(el => {
          const [key, value]: string[] = el.split('=');
          obj[key] = decodeURIComponent(value);
        });
      }
      return obj;
    }
    get getLoadingStatus(): boolean {
      return this.$store.state.loadingStatus;
    }
    protected async created(): Promise<any> {
      window.document.title = '比高篮球';
      this.$store.commit('setPhone');
      this.query = this.getUrlQuery();
      console.log(location.href)
      if (location.href.includes('code')) {
        try {
          
        } catch (error) {
          this.$toast(`${error || '登录失败，请稍后重试'}`);
        }
      }
      // this.query.userid && this.$store.commit('saveUserid', this.query.userid);
      try {
        this.status = true;
      } catch (error) {
        this.$toast(error);
      }
    }
  }
</script>


<style lang="scss">
  .container {
    display: flex;
    min-height: 100vh;
    align-items: center;
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
