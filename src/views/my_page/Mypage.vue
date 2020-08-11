<template>
  <div>
    <div v-if="userinfo.head" class="page">
      <div class="top">
        <div class="info">
          <img :src="userinfo.head">
          <span class="name">{{userinfo.uname}}</span>
        </div>
        <div class="vip">
          <div class="vip_icon">VIP</div>
          <span class="name">比高会员</span>
          <span class="time">{{overTime}}到期</span>
        </div>
      </div>
      <div class="my_class">
        <div class="wrapper">
          <div v-for="(item, index) in className" :key="index" class="class_type">
            <div class="num">{{classList[index]}}</div>
            <div class="name">{{item}}</div>
          </div>
        </div>
      </div>
      <van-cell class="cell" title="上课记录" icon="notes-o" @click="$toast('功能正在开发~')" />
      <van-cell class="cell" :title="userinfo.role === 1 ? '课程打分' :'教练评语'" :icon="userinfo.role === 1 ? 'good-job-o' : 'comment-o'" @click="$router.push(`/comment?role=${userinfo.role}`)" />
      <van-cell class="cell" title="分享比高" icon="ellipsis" @click="isShow = true" />
      <a href="tel: 13540497299"><van-cell class="cell" title="联系客服" icon="service-o" /></a>
    </div>
    <share-popup v-if="isShow" :isShow.sync="isShow" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Button, Icon, Cell } from 'vant'
  @Component({
    components: {
      [Button.name]: Button,
      [Icon.name]: Icon,
      [Cell.name]: Cell,
      SharePopup: () => import('./share_popup/SharePopup.vue')
    }
  })
  export default class MyPage extends Vue {
    private className: string[] = ['剩余课程', '已上课程', '本周剩余'];
    private classList: number[] = [];
    private isShow: boolean = false;
    private overTime: string = null;
    private userinfo: object = {};
    protected created(): void {
      if (!this.$store.state.userid) {
        const url = encodeURIComponent(`${location.origin + location.pathname}`);
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf6b5696049ee6487&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo#wechat_redirect`;
      }
      this.getInfo();
    }
    private async getInfo(): Promise<any> {
      try {
        const { beeagleUsers, buySum, eveWeek, remaSum, remaWeek, vipOutTime } = await this.$api({
          url: `/courseRema/findById?userid=${this.$store.state.userid || 63}`,
          method: 'get',
        })
        this.formatOverTime(vipOutTime);
        this.classList.push(remaSum, buySum - remaSum, remaWeek);
        this.userinfo = beeagleUsers;
        this.$store.commit('setLoadingStatus', false);
      } catch (error) {
        this.$toast.fail(`${error}`);
      }
    }
    private setting(): void {

    }
    private formatOverTime(e: number): void {
      const time = new Date(e);
      this.overTime = time.toLocaleDateString().split('/').join('-');
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    .top {
      background-color: #c7c7c7;
      padding: 30px 20px 60px 20px;
      .info {
        display: flex;
        align-items: center;
        word-break: break-all;
        justify-content: flex-start;
        &>img {
          width: 66px;
          height: 66px;
          object-fit: cover;
          border-radius: 50%;
        }
        .name {
          flex: 1;
          color: #000;
          margin: 0 20px;
          font-size: 16px;
          font-weight: 600;
        }
      }
      .vip {
        display: flex;
        font-size: 13px;
        margin-top: 20px;
        padding: 10px 12px;
        border-radius: 10px;
        align-items: center;
        justify-content: flex-start;
        background: linear-gradient(270deg, #f1cd7f, #f5c55d);
        .vip_icon {
          width: 36px;
          color: #ebebeb;
          font-weight: bold;
          line-height: 24px;
          text-align: center;
          border-radius: 6px;
          background-color: #414141;
        }
        .name {
          margin-left: 20px;
        }
        .time {
          flex: 1;
          color: #fd5d12;
          text-align: right;
          margin-right: 10px;
        }
      }
    }
    .my_class {
      padding: 0 12px;
      margin-top: -40px;
      .wrapper {
        display: flex;
        padding: 12px 40px;
        border-radius: 12px;
        align-items: center;
        background-color: #fff;
        justify-content: space-between;
        .class_type {
          text-align: center;
          .num {
            margin-bottom: 15px;
          }
        }
      }
    }
    .cell {
      margin-top: 12px;
    }
  }
</style>
