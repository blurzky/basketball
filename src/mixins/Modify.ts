import { Vue } from 'vue-property-decorator';
// 门店设置修改基类
export default class Modify extends Vue {
  protected maxSize: number = 20480000; // 上传最大size
  protected defaultImg: any = require('@/views/apply/fill_in_information/icon/shop_in_default_picture@2x.png'); // 上传显示默认图片
  protected icon: any = require('@/views/apply/fill_in_information/icon/public_icon_inter_grey@2x.png'); // 右箭头
  protected onOversize(): void { // 上传超出最大size的回调
    this.$toast(`文件大小不能超过${this.maxSize / 1024}M`);
  }
}
