<template>
  <div class="canlendar">
    <div class="title">
      <img src="../assets/img/dark_arrow.png" @click="changeMonth(0)">
      <div class="date">{{year}}年{{month}}月</div>
      <img src="../assets/img/right.png" @click="changeMonth(1)">
    </div>
    <div class="weeks" style="backgroundColor: #eeeeee">
      <div class="day" v-for="(item, index) in days" :key="index">{{item}}</div>
    </div>
    <div class="weeks">
      <div class="day" v-for="(item, index) in putDay" :key="`put${index}`"></div>
      <div class="day" :class="day === index + 1 && todayMonth === month && todayYear === year ? `today` : ''" v-for="(item, index) in monthDay" :key="`day${index}`">{{index + 1}}</div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'
  @Component
  export default class Canlendar extends Vue {
    private year: number = null;
    private month: number = null;
    private todayMonth: number = null;
    private todayYear: number = null;
    private day: number = null;
    private weekDay: number = null;
    private putDay: number = null;
    private days: string[] = ['一', '二', '三', '四', '五', '六', '日',];
    private monthDay: number = 31;
    private created(): void {
      this.getTime();
    }
    private getTime(): void {
      if (this.month === this.todayMonth && this.todayYear === this.year) {
        const time = new Date();
        this.todayYear = this.year = time.getFullYear();
        this.todayMonth = this.month = time.getMonth() + 1;
        this.day = time.getDate();
        this.weekDay = time.getDay();
      } else {
        const time = new Date(this.year, this.month - 1, 1);
        this.day = time.getDate();
        this.weekDay = time.getDay();
      }
      if (this.month === 4 || this.month === 6 || this.month === 9 || this.month === 11) {
        this.monthDay = 30;
      } else if (this.month === 2) {
        this.monthDay = 28;
        if (this.year % 4 === 0) {
          this.monthDay = 29;
        }
      } else {
        this.monthDay = 31;
      }
      this.putDay = this.weekDay + 6 - ((this.day - 1) % 7);
    }
    private changeMonth(type: number): void {
      this.monthDay = 0;
      if (type === 0) {
        this.month--;
        if (this.month < 1) {
          this.month = 12;
          this.year--;
        }
      } else {
        this.month++;
        if (this.month > 12) {
          this.month = 1;
          this.year++;
        }
      }
      this.getTime();
    }
  }
</script>

<style lang="scss" scoped>
.canlendar {
  padding: 20px 0;
  margin-top: 28px;
  background-color: #fff;
  .title {
    display: flex;
    padding: 0 10px;
    align-items: center;
    justify-content: space-between;
    &> img {
      width: 22px;
      height: 22px;
    }
    .date {
      font-size: 18px;
      font-weight: bold;
    }
  }
  .weeks {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    align-items: center;
    justify-content: flex-start;
    .day, .today {
      width: vw(50);
      font-size: 16px;
      text-align: center;
      line-height: vw(50);
    }
    .today {
      color: #fff;
      background-color: #2183f3;
    }
  }
}
</style>