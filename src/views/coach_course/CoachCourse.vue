<template>
  <div>
    <div class="tabs_wrapper">
      <div class="tabs">
        <div class="tab" :class="choose === index ? `choose_tab` : ''" v-for="(item, index) in tabs" :key="index" @click="chooseTab(index)">{{item}}</div>
      </div>
    </div>
    <div class="page" v-if="pageShow">
      <div v-if="choose === 0" class="wait_start">
        <div v-for="({addr, courseName, date, end_time, people, start_time, week, courseId}, index) in waitList" :key="index" class="every_course">
          <div class="time">{{date}}</div>
          <div class="content">
            <div class="course_info">
              <div class="course_name">{{courseName}}</div>
              <div class="course_addr">{{addr}}</div>
              <div class="course_addr">上课人数：{{people}}人</div>
            </div>
            <div class="time_info">
              <div>{{week}}</div>
              <div class="week">{{start_time+ ' - ' +end_time}}</div>
              <div class="week">{{(end_time.slice(0, 2) - start_time.slice(0, 2))*60}}分钟</div>
            </div>
            <div class="course_btn">
              <div class="upload_course" @click="$router.push(`/upload_course?courseId=${courseId}`)">上传教案</div>
              <div class="end_course">结束上课</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="all_course">
        <Canlendar :monthClass="monthClass" @getMonthData="getMonthData" @getMonthDay="getMonthDay" />
        <div v-for="({addr, courseName, end_time, start_time, state}, index) in searchList" :key="index" class="every_course" >
          <div class="course_info">
            <div class="course_name">{{courseName}}</div>
            <div class="course_addr">{{addr}}</div>
          </div>
          <div class="state">{{ state | setState }}</div>
          <div class="time_info" style="color: #8889f7">
            <div class="week">{{start_time+ ' - ' +end_time}}</div>
            <div class="week">{{(end_time.slice(0, 2) - start_time.slice(0, 2))*60}}分钟</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  @Component({
    components: {
      Canlendar: () => import('../../components/Canlendar.vue')
    },
    filters: {
      setState(e: string) {
        const type = Number(e);
        if (type === 0) {
          return '还未排课'
        } else if (type === 1) {
          return '等待教案'
        } else if (type === 2) {
          return '等待上课'
        } else if (type === 3) {
          return '正在上课'
        } else {
          return '已结束'
        }
      }
    }
  })
  export default class CoachCourse extends Vue {
    private choose: number = 0;
    private tabs: string[] = ['即将开始', '全部'];
    private waitList: any[] = [];
    private monthClass: any[] = [];
    private pageShow: boolean = false;
    private nowDate: string = '';
    private searchDate: string = '';
    private searchList: any[] = [];

    protected created(): void {
      this.$store.commit('saveUserid', 64);
      this.getList();
      const time = new Date();
      this.nowDate = `${time.getFullYear()}-${time.getMonth() + 1}-01`;
      this.searchDate = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
    }
    private chooseTab(index: number): void {
      this.pageShow = false;
      if (index !== this.choose) {
        if (index === 0) {
          this.getList();
        } else {
          this.getMonthData(this.nowDate);
        }
        this.choose = index;
      }
    }
    private async getList(): Promise<any> {
      if (!this.$store.state.loadingStatus) {
        this.$toast.loading();
      }
      try {
        const obj = await this.$api({
          url: '/course/findCoursesByUserid',
          data: {
            userid: this.$store.state.userid
          }
        });
        this.waitList = obj;
        this.pageShow = true;
        this.$toast.clear();
        this.$store.commit('setLoadingStatus', false);
      } catch(error) {
        this.$toast.fail(error);
      }
    }
    private async getMonthData(date: string): Promise<any> {
      this.$toast.loading();
      this.getMonthDay();
      this.monthClass = [];
      try {
        const obj = await this.$api({
          url: '/course/findDayCourse',
          data: {
            userid: this.$store.state.userid,
            date: date
          }
        });
        obj.forEach((e: any, index: number) => {
          if (e.isHave > 0) {
            this.monthClass.push(index);
          }
        });
        this.$toast.clear();
        this.pageShow = true;
      } catch(error) {
        this.$toast.fail(error);
      }
    }
    private async getMonthDay(date?: string): Promise<any> {
      this.$toast.loading();
      this.searchList = [];
      try {
        const obj = await this.$api({
          url: '/course/findDayCourseInfo',
          data: {
            userid: this.$store.state.userid,
            date: date ? date : this.searchDate
          }
        });
        this.searchList = obj;
        this.$toast.clear();
      } catch(error) {
        this.$toast.fail(error);
      }
    }
    private async endClass(): Promise<any> {
      this.$toast.loading();
      try {
        const obj = await this.$api({
          url: '/course/finshCourse',
          data: {
            // courseId: ,
            // coachId: ,
          }
        });
        this.$toast.clear();
      } catch(error) {
        this.$toast.fail(error);
      }
    }
  }
</script>

<style lang="scss" scoped>
.tabs_wrapper {
  top: 0;
  left: 0;
  z-index: 99;
  width: 100%;
  position: fixed;
  padding: 20px 0;
  background-color: #fff;
  .tabs {
    width: 200px;
    display: flex;
    margin: 0 auto;
    overflow: hidden;
    align-items: center;
    border-radius: 12px;
    justify-content: center;
    border: 1px solid #2183f3;
    .tab, .choose_tab {
      width: 50%;
      font-size: 15px;
      padding: 6px 10px;
      text-align: center;
      transition: all .3s;
    }
    .choose_tab {
      color: #fff;
      background-color: #2183f3;
    }
  }
}
.page {
  margin-top: 74px;
  background-color: #ffffff;
  .wait_start {
    width: 100%;
    padding: 0 8px;
    box-sizing: border-box;
    .every_course {
      border-radius: 8px;
      margin-bottom: 10px;
      padding: 0 10px 10px 0;
      background-color: #f0f0f0;
      box-shadow: 3px 3px 3px #cccccc;
      .time {
        width: 100px;
        font-weight: 500;
        line-height: 20px;
        text-align: center;
        border-radius: 0 0 8px 0;
        background-color: #ff9879;
      }
      .content {
        display: flex;
        margin-top: 5px;
        align-items: flex-start;
        justify-content: space-between;
        .course_info {
          padding: 0 15px;
          .course_name {
            font-size: 14px;
            font-weight: bold;
          }
          .course_addr {
            margin-top: 8px;
            color: #7a7a7a;
          }
        }
        .time_info {
          color: #e77eeb;
          padding: 8px 20px;
          text-align: center;
          border-radius: 5px;
          background-color: #fff;
          .week {
            margin-top: 5px;
          }
        }
        .course_btn {
          .upload_course, .end_course  {
            color: #e6e6e6;
            padding: 6px 8px;
            border-radius: 5px;
            background-color: #5255e6;
          }
          .end_course {
            margin-top: 15px;
            background-color: #49dda4;
          }
        }
      }
    }
  }
  .all_course {
    .every_course {
      display: flex;
      padding: 5px 0;
      text-align: center;
      align-items: center;
      border-bottom: 1px solid #d8d8d8;
      justify-content: space-between;
      .course_info {
        padding: 0 15px;
        .course_name {
          font-size: 14px;
          font-weight: bold;
        }
        .course_addr {
          margin-top: 8px;
          color: #7a7a7a;
        }
      }
      .time_info {
        color: #e77eeb;
        padding: 8px 20px;
        border-radius: 5px;
        background-color: #fff;
        .week {
          margin-top: 5px;
        }
      }
      .state {
        font-size: 16px;
        color: #b4b4b4;
      }
    }
  }
}
</style>