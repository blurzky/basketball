<template>
  <div>
    <div class="page">
      <div class="icon_box" v-if="badge.length">
        <span>效率({{badge[3].toFixed(2)}}%)</span>
        <img src="./icon/calendar.png" class="icon" @click="dateShow = true" />
      </div>
      <van-tabs v-model="active" sticky color="#73a2f8" line-width="30" @change="changeTab">
        <van-tab v-for="(item, index) in tabs" :key="index" :title="`${item}(${badge[index]})`" title-style="title_style">
          <div class="box">
            <div v-for="({addr, birthday, ctime, start_time, end_time, week, tel, rname, gradle_class}, index) in list" :key="index" class="card">
              <div class="card_top">
                <div class="set_time">
                  <img src="./icon/clock.png" />
                  <span>{{ctime}}</span>
                </div>
                <div class="userinfo">
                  <div class="info_left">
                    <div>{{rname}}</div>
                    <div class="bottom">
                      <a :href="`tel: ${tel}`">{{tel}}</a>
                    </div>
                  </div>
                  <div class="info_right">
                    <div class="age">{{new Date().getFullYear() - birthday.substr(0, 4)}}岁</div>
                    <div>{{gradle_class}}</div>
                  </div>
                </div>
                <div class="dateinfo">
                  <div class="date_top">{{week ? week : '暂未选课'}}</div>
                  <div class="date_bottom">{{start_time}}至{{end_time}}</div>
                </div>
                <div class="position">
                  <img src="./icon/position.png">
                  <span>{{addr}}</span>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
      <van-calendar :min-date="minDate" :max-date="maxDate" ref="calendar" v-model="dateShow" type="range" @confirm="chooseDate" />
      <div v-if="dateShow" class="clear_date">
        <van-button round type="info" size="small" class="clear_btn" @click="clearDate()">清除时间筛选</van-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Tab, Tabs, Calendar, Button } from 'vant'
  @Component({
    components: {
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [Calendar.name]: Calendar,
      [Button.name]: Button,
    }
  })
  export default class Statistic extends Vue {
    private minDate: any = new Date(2016, 0 ,1);
    private maxDate: any= new Date();
    private active: number = 0;
    private tabs: string[] = ['已引流', '待转化', '已转化'];
    private dateShow: boolean = false;
    private size: number = 0;
    private date: string[] = ['', ''];
    private list: any = [];
    private badge: string[] = [];
    protected created(): void {
      this.$store.commit('saveUserid', 84);
      this.getList();
    }
    private beforeDestroy(): void {
      window.removeEventListener('scroll', this.scroll);
    }
    private changeTab(e: number): void {
      this.list = [];
      this.getList();
    }
    private scroll(e: any): void {
      const height = document.body.scrollHeight;
      const scrollTop = Math.ceil(document.documentElement.scrollTop + document.documentElement.clientHeight);
      if (scrollTop >= height && this.list.length && this.list.length % 20 === 0) {
        this.size += 1;
        this.getList();
      }
    }
    private async getList(): Promise<any> {
      const { date, size, active } = this;
      if (!this.$store.state.loadingStatus) {
        this.$toast.loading();
      }
      try {
        const { daizh, list, radio, yinliu, yizh } = await this.$api({
          url: '/courseTrial/findTongjiData',
          data: {
            userid: this.$store.state.userid,
            sTime: date[0],
            eTime: date[1],
            size: size,
            type: active + 1
          }
        })
        this.list.push(...list);
        this.badge = [yinliu, daizh, yizh, radio];
        this.$nextTick(() => {
          window.addEventListener('scroll', this.scroll);
        });
        this.$toast.clear();
        this.$store.commit('setLoadingStatus', false);
      } catch (error) {
        this.$toast(error);
      }
    }
    private chooseDate(e: any): void {
      const start = e[0].toLocaleDateString().split('/').join('-');
      const end = e[1].toLocaleDateString().split('/').join('-');
      this.date = [start, end];
      this.list = [];
      this.getList();
      this.dateShow = false;
    }
    private clearDate(): void {
      this.list = [];
      this.date = ['', ''];
      (this.$refs.calendar as any).reset();
      this.getList();
      this.dateShow = false;
    } 
  }
</script>

<style lang="scss" scoped>
  .page {
    position: relative;
    /deep/ .van-tabs__nav {
      width: 70%;
    }
    /deep/ .van-tab__text {
      font-size: vw(14);
    }
    .clear_date {
      top: 0;
      left: 0;
      width: 100%;
      height: 44px;
      display: flex;
      z-index: 9999;
      position: fixed;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      .clear_btn {
        width: 150px;
      }
    }
    .icon_box {
      top: 0;
      right: 2px;
      width: 30%;
      height: 44px;
      z-index: 999;
      display: flex;
      position: fixed;
      align-items: center;
      background-color: #fff;
      justify-content: space-around;
      &>span {
        font-size: 12px;
      }
      .icon {
        width: vw(25);
        height: vw(25);
      }
    }
    .box {
      display: flex;
      padding: 10px;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      .card {
        width: vw(170);
        overflow: hidden;
        border-radius: 12px;
        margin-bottom: 10px;
        padding-bottom: 5px;
        background-color: #fff;
        .card_top {
          background-color: #FF6868;
          .set_time {
            display: flex;
            color: #fff;
            width: vw(120);
            line-height: 18px;
            text-align: center;
            align-items: center;
            justify-content: center;
            border-radius: 0 0 8px 0;
            background-color: #FFA136;
            &>img {
              width: 11px;
              height: 11px;
              margin-right: 5px;
            }
          }
          .userinfo {
            display: flex;
            padding: 10px;
            font-size: 11px;
            align-items: center;
            justify-content: space-between;
            .info_left {
              color: #fff;
              .bottom {
                margin-top: 10px;
                a:link {
                  color: #fff;
                }
                a:visited {
                  color: #fff;
                }
                a:active {
                  color: #fff;
                }
              }
            }
            .info_right{
              flex: 1;
              padding: 3px;
              height: 50px;
              color: #000;
              max-width: 45px;
              overflow: hidden;
              font-weight: bold;
              text-align: center;
              border-radius: 3px;
              background-color: #fff;
              .age {
                margin-bottom: 5px;
              }
            }
          }
          .dateinfo {
            padding: 8px;
            line-height: 18px;
            text-align: center;
            background-color: #fff;
            .date_top {
              height: 18px;
              color: #fff;
              background-color: #FFA136;
            }
            .date_bottom {
              height: 18px;
              border-radius: 0 0 8px 8px;
              border-left: 1px solid #d8d8d8;
              border-right: 1px solid #d8d8d8;
              border-bottom: 1px solid #d8d8d8;
            }
          }
          .position {
            display: flex;
            padding: 0 8px;
            color: #919191;
            align-items: center;
            background-color: #fff;
            justify-content: flex-start;
            &>img {
              width: 11px;
              height: 13px;
              margin-right: 3px;
            }
          }
        }
      }
    }
  }
</style>