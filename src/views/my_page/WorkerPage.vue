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
      <van-cell v-if="menus.includes(1)" class="cell" title="课程表" icon="notes-o" @click="$router.push(`/coach_course`)" />
      <van-cell v-if="menus.includes(2)" class="cell" title="审核教案" icon="notes-o" @click="$router.push(`/check_course`)" />
      <van-cell v-if="menus.includes(3)" class="cell" title="引流数据" icon="notes-o" @click="$router.push('/statistic')" />
      <van-cell v-if="menus.includes(4)" class="cell" title="缴费上报" icon="shopping-cart-o" @click="$router.push('/mall?home=11')" />
      <van-cell v-if="menus.includes(5)" class="cell" title="课程打分" icon="good-job-o" @click="$router.push(`/worker_comment`)" />
      <van-cell v-if="menus.includes(6)" class="cell" title="教练评语" icon="comment-o" @click="$router.push(`/user_comment`)" />
      <van-cell v-if="menus.includes(7)" class="cell" title="VIP二维码" icon="scan" @click="$router.push(`/qr`)" />
      <van-cell v-if="menus.includes(8)" class="cell" title="我的二维码" icon="scan" @click="$router.push(`/my_qr`)" />
      <van-cell v-if="menus.includes(9)" class="cell" title="自主选课-审核" icon="label-o" @click="$router.push(`/check_mall?rectorId=${rectorId}`)" />
      <van-cell v-if="menus.includes(10)" class="cell" title="教练评价-审核" icon="label-o" @click="$router.push(`/coach_check?rectorId=${rectorId}`)" />
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
      [Cell.name]: Cell,
    }
  })
  export default class WorkerPage extends Vue {
    private overTime: string = null;
    private rectorId: number = null;
    private userinfo: object = {};
    private menus: string[] = [];
    private role: number = null;
    protected created(): void {
      this.getInfo();
    }
    private async getInfo(): Promise<any> {
      try {
        const { beeagleUsers, worker, menus } = await this.$api({
          url: `/courseRema/findById?userid=${this.$store.state.userid}`,
          method: 'get',
        })
        if (worker.entryTime) {
          this.formatOverTime(worker.entryTime);
        }
        this.userinfo = worker;
        this.menus = menus;
        this.rectorId = beeagleUsers.sysUserId;
        this.role = beeagleUsers.role;
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
    background: center / cover;
    background-image: url('./icon/Clip@2x.png');
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
        flex: 1;
        margin-left: 15px;
        color: #fff;
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
        width: 80px;
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
