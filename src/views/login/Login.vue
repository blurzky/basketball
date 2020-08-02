<template>
  <div>
    <custom-nav title="登录" border-color="#dbdbdb" />
    <div class="page">
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Button } from 'vant'
  @Component({
    components: {
      [Button.name]: Button
    }
  })
  export default class Login extends Vue {
    protected created(): void {
      // if (!this.$store.state.userid) {
      //   const url = encodeURIComponent(`${location.origin + location.pathname}`);
      //   window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf6b5696049ee6487&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo#wechat_redirect`;
      // }
      // this.$store.commit('setLoadingStatus', false);
      // this.$router.push('/mypage');
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    background-color: #ececec;
  }
</style>
