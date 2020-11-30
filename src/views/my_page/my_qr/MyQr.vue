<template>
  <div v-if="myImg" class="my_qr">
    <img class="qr_code" :src="myImg" />
    <div class="bottom">长按上方保存至相册</div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  @Component
  export default class MyQr extends Vue {
    private info: any = null;
    private myImg: any = null;
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
        this.$nextTick(() => {
          this.drawImg();
        });
        this.$store.commit('setLoadingStatus', false);
      } catch (error) {
        this.$toast.fail(`${error}`);
      }
    }
    private async drawImg(): Promise<any> {
      try {
        const {qrcode, uname, tel, addr, head} = this.info
        //画图
        let canvas: any  = document.createElement('canvas')
        canvas.width = 1280;
        canvas.height = 1650;
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillRect(0,0,1280,1650);
        //头像
        const url1 = await this.loadImage(head);
        this.getImg(ctx, url1, 20, 20, 380, 380);
        //文字
        if (uname && tel) {
          this.font(ctx, 45, `${uname} ${tel}`, 450, 150);
        }
        if (addr) {
          if (addr.length > 15) {
          this.font(ctx, 45, `${addr.substring(0,20)}...`, 450, 250);
          } else {
            this.font(ctx, 45, `${addr}`, 450, 250);
          }
        }
        //二维码
        const url2 = await this.loadImage(qrcode);
        this.getImg(ctx, url2, 50, 420, 1180, 1180);
        //导出base64路径
        this.myImg = ctx.canvas.toDataURL();
      } catch (error) {
        console.log(error);
      }
    }
    //绘制字体
     private font(ctx: any, size: any, text: any, x: any, y: any): void {
      ctx.font = `${size}px sans-serif`;
      ctx.fillStyle = "#000000";
      ctx.fillText(text, x, y);
    };
    //绘制图片
    private getImg(ctx: any, url: any, x: any, y: any, width: any, height: any): void {
      ctx.drawImage(url, x, y, width, height);
    };
    // 加载图片
    private loadImage(url: any): Promise<any> {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.setAttribute('crossOrigin', 'anonymous');
        image.onload = () => {
          resolve(image);
        }
        image.onerror = error => {
          reject('绘制失败，请稍后重试');
        }
        image.src = url;
      });
    };
    private dataURLtoFile(dataurl: any, filename: any) {
      let arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type:mime});
    }
  }
</script>

<style lang="scss" scoped>
.my_qr {
  padding: 12px;
  background-color: #ececec;
  .qr_code {
    width: 100%;
    object-fit: cover;
  }
  .bottom {
    font-size: 14px;
    margin-top: 20px;
  }
}
</style>