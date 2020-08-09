<template>
  <div>
    <div class="page">
      <div class="top">
        <div class="info">
          <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596966043470&di=c8fdcc0ae6dcbf9b6e73a0db82700223&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fw%3D580%2Fsign%3Da9714efaaf86c91708035231f93c70c6%2Fddd3ab59d109b3dea0394e6ac4bf6c81810a4c48.jpg">
          <span class="name">dasfasfasfasdasfasfasfasdasfasfasfasdasfasfasfas</span>
          <van-icon name="setting-o" size="22" />
        </div>
        <div class="vip">
          <div class="vip_icon">VIP</div>
          <span class="name">比高会员</span>
          <span class="time">2020-12-11到期</span>
        </div>
      </div>
      <div class="my_class">
        <div class="wrapper">
          <div v-for="(item, index) in className" :key="index" class="class_type">
            <div class="num">11</div>
            <div class="name">{{item}}</div>
          </div>
        </div>
      </div>
      <van-cell class="cell" title="上课记录" icon="notes-o" />
      <van-cell class="cell" title="课程打分" icon="good-job-o" />
      <van-cell class="cell" title="教练评语" icon="comment-o" />
      <van-cell class="cell" title="分享比高" icon="ellipsis" />
      <van-cell class="cell" title="联系客服" icon="service-o" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Button, Icon, Cell } from 'vant'
  @Component({
    components: {
      [Button.name]: Button,
      [Icon.name]: Icon,
      [Cell.name]: Cell
    }
  })
  export default class MyPage extends Vue {
    private className: string[] = ['剩余课程', '已上课程', '本周剩余'];
    protected created(): void {
      this.getInfo();
    }
    private async getInfo(): Promise<any> {
      try {
        const obj = await this.$api({
          url: `/courseRema/findById?userid=${this.$store.state.userid || 88}`,
          method: 'get',
        })
        this.$store.commit('setLoadingStatus', false);
      } catch (error) {
        this.$toast.fail(`${error}`);
      }
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
        font-size: 14px;
        margin-top: 20px;
        padding: 10px 12px;
        border-radius: 10px;
        align-items: center;
        justify-content: flex-start;
        background: linear-gradient(270deg, #f1cd7f, #f5c55d);
        .vip_icon {
          width: 40px;
          color: #ebebeb;
          font-weight: bold;
          line-height: 30px;
          text-align: center;
          border-radius: 6px;
          background-color: #414141;
        }
        .name {
          margin-left: 20px;
        }
        .time {
          flex: 1;
          color: #fb801a;
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
