<template>
  <transition name="loading" appear>
    <div v-if="myImg" class="qr_code" @click="close">
      <img class="qr_img" :src="myImg" />
      <div class="btns">长按上方图片保存</div>
    </div>
  </transition>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'
  @Component
  export default class QrCodePopup extends Vue {
    @Prop(Boolean) private saveShow!: boolean;
    @Prop(Object) private info!: any;
    private myImg: any = null;
    protected created(): void {
      this.$nextTick(() => {
        this.drawImg();
      });
    };
    private close(): void {
      this.$emit('update:saveShow', false);
    }
    private async drawImg(): Promise<any> {
      try {
        const {qrcode, uname, tel, addr} = this.info
        //画图
        let canvas: any  = document.createElement('canvas')
        canvas.width = 1280;
        canvas.height = 2400;
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "rgb(255,255,255)";
        //背景
        const url1 = await this.loadImage(require('../../../../static/qr_back.jpg'));
        this.getImg(ctx, url1, 0, 0, 1280, 2400);
        //二维码
        const url2 = await this.loadImage(qrcode);
        this.getImg(ctx, url2, 535, 1770, 300, 300);
        //文字
        this.font(ctx, 45, `联系电话：${uname} ${tel}`, 330, 2180);
        if (addr.length > 15) {
          this.font(ctx, 45, `训练地址：${addr.substring(0,20)}...`, 330, 2330);
        } else {
          this.font(ctx, 45, `训练地址：${addr}`, 330, 2300);
        }
        //导出base64路径
        this.myImg = ctx.canvas.toDataURL();
      } catch (error) {
        console.log(error);
      }
    }
    //绘制字体
     private font(ctx: any, size: any, text: any, x: any, y: any): void {
      ctx.font = `${size}px sans-serif`;
      ctx.fillStyle = "#ffffff";
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
.loading-enter, .loading-leave-active {
  opacity: 0;
}
.qr_code {
  top: 0;
  left: 0;
  z-index: 99;
  width: 100vw;
  display: flex;
  position: fixed;
  min-height: 100vh;
  align-items: center;
  transition: all .3s;
  flex-direction: column;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.911);
  .qr_img {
    width: vw(320);
    height: vw(600);
    object-fit: cover;
  }
  .btns {
    color: #333;
    line-height: 20px;
    padding: 10px 20px;
    border-radius: 22px;
    margin-bottom: 10px;
    background-color: #fff;
  }
}
</style>