<template>
  <div v-if="info" class="qr_code">
    <div class="img_box" id="qr_code">
      <img class="code_img" :src="info.qrcode" />
      <div class="connect" v-if="info.uname && info.tel">联系电话：{{info.uname}} {{info.tel}}</div>
      <div class="address" v-if="info.addr">训练地址：{{info.addr}}</div>
    </div>
    <div class="btns">
      <van-button plain color="#6639b8" :hairline="true" round @click="saveShow = true">保存至相册</van-button>
    </div>
    <Popup v-if="saveShow" :saveShow.sync="saveShow" :info="info" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Button } from 'vant'
  @Component({
    components: {
      [Button.name]: Button,
      Popup: () => import('./QrCodePopup.vue')
    }
  })
  export default class QrCode extends Vue {
    private saveShow: boolean = false;
    private info: any = null;
    protected created(): void {
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
  background-color: #ececec;
  .img_box {
    width: vw(320);
    height: vw(600);
    position: relative;
    background-size: 100%;
    background-position: cover;
    background-repeat: no-repeat;
    background-image: url('../../../../static/qr_back.jpg');
    .code_img {
      top: vw(420);
      left: vw(135);
      width: vw(70);
      height: vw(70);
      position: absolute;
    }
    .connect {
      top: vw(505);
      left: vw(80);
      color: #fff;
      flex-wrap: wrap;
      font-size: vw(10);
      position: absolute;
      max-width: vw(200);
    }
    .address {
      top: vw(535);
      left: vw(80);
      color: #fff;
      flex-wrap: wrap;
      font-size: vw(10);
      position: absolute;
      max-width: vw(200);
    }
  }
}
</style>