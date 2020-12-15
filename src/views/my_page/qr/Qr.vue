<template>
  <div v-if="info.qrcodeUrl" class="qr_code">
    <img class="code_img" :src="info.qrcodeUrl" />
    <div class="btns">
      <van-button plain color="#274570" :hairline="true" round>长按上方图片保存至相册</van-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Button } from 'vant'
  @Component({
    components: {
      [Button.name]: Button,
    }
  })
  export default class Qr extends Vue {
    private info: any = null;
    protected created(): void {
      this.$store.commit('saveUserid', 85);
      this.getInfo();
    };
    private async getInfo(): Promise<any> {
      try {
        const obj = await this.$api({
          url: `/courseRema/findQrCode?userid=${this.$store.state.userid}`,
          method: 'get',
        })
        this.info = obj;
        this.$store.commit('setLoadingStatus', false);
      } catch (error) {
        this.$toast.fail(`${error}`);
      }
    }
  }
</script>

<style lang="scss" scoped>
.qr_code {
  padding-bottom: 20px;
  background-color: #ececec;
  .code_img {
    width: 100%;
    object-fit: cover;
    margin-bottom: 20px;
  }
}
</style>