<template>
  <div>
    <div v-if="$store.state.userid" class="page">
      <div class="top">
        <div class="info">
          <img :src="userinfo.head">
          <div class="middle">
            <div class="name">{{userinfo.uname}}</div>
            <div class="position">
              <van-icon name="location-o" color="#fff" size="14px" />
              <span>{{userinfo.addr || '暂未分配校区'}}</span>
            </div>
            <div class="position">
              <van-icon name="notes-o" color="#fff" size="14px" />
              <span v-if="overTime">{{overTime}}入职</span>
              <span v-else>等待录入</span>
            </div>
          </div>
          <div class="right">{{userinfo.job}}</div>
        </div>
      </div>
      <van-cell class="cell" title="课程表" icon="notes-o" @click="$router.push(`/coach_course`)" />
      <van-cell class="cell" title="审核教案" icon="notes-o" @click="$router.push(`/check_course`)" />
      <van-cell class="cell" title="引流数据" icon="notes-o" @click="$router.push('/statistic')" />
      <van-cell class="cell" title="缴费上报" icon="shopping-cart-o" @click="$router.push('/mall?home=11')" />
      <van-cell class="cell" title="课程打分" icon="good-job-o" @click="$router.push(`/comment?role=1}`)" />
      <van-cell class="cell" title="教练评语" icon="comment-o" @click="$router.push(`/comment?role=${userinfo.role}`)" />
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
  export default class WorkerPage extends Vue {
    private isShow: boolean = false;
    private overTime: string = null;
    private userinfo: object = {};
    protected created(): void {
      this.getInfo();
    }
    private async getInfo(): Promise<any> {
      try {
        const { worker } = await this.$api({
          url: `/courseRema/findById?userid=${this.$store.state.userid}`,
          method: 'get',
        })
        if (worker.entryTime) {
          this.formatOverTime(worker.entryTime);
        }
        this.userinfo = worker;
        this.$store.commit('setLoadingStatus', false);
      } catch (error) {
        this.$toast.fail(`${error}`);
      }
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
      padding: 20px;
      background-color: #383838;
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
        .middle {
          color: #fff;
          margin: 0 vw(20);
          .name {
            font-size: 18px;
            font-weight: 500;
          }
          .position {
            display: flex;
            margin-top: 15px;
            align-items: center;
            justify-content: flex-start;
            &>span {
              margin-left: 5px;
            }
          }
        }
        .right {
          color: #fff;
          font-size: 14px;
          padding: vw(10) 0;
          align-self: flex-start;
        }
      }
    }
    .cell {
      margin-top: 12px;
    }
  }
</style>
