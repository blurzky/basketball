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
      <div
        class="day"
        :class="day === index + 1 && todayMonth === month && todayYear === year ? `today` : ''"
        :style="chooseDate === index ? 'backgroundColor: #d8d8d8' : ''"
        v-for="(item, index) in monthDay" :key="`day${index}`"
        @click="chooseDay(index)"
      >
        {{index + 1}}
        <div v-if="monthClass.includes(index)" class="mark">课</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component
export default class Canlendar extends Vue {
  @Prop(Array) protected monthClass!: any[];
  private year: number = null;
  private month: number = null;
  private todayMonth: number = null;
  private todayYear: number = null;
  private day: number = null;
  private weekDay: number = null;
  private putDay: number = null;
  private days: string[] = ['一', '二', '三', '四', '五', '六', '日',];
  private monthDay: number = 31;
  private chooseDate: number = null;
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
    this.chooseDate = null;
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
    this.$emit('getMonthData', `${this.year}-${this.month}-01`);
    this.getTime();
  }
  private chooseDay(index: number): void {
    this.chooseDate = index;
    this.$emit('getMonthDay', `${this.year}-${this.month}-${this.chooseDate + 1}`);
  }
}
</script>

<style lang="scss" scoped>
.canlendar {
  background-color: #fff;
  .title {
    display: flex;
    padding: 0 10px;
    line-height: 44px;
    align-items: center;
    background-color: #8889f7;
    justify-content: space-between;
    &> img {
      width: 22px;
      height: 22px;
    }
    .date {
      color: #fff;
      font-size: 18px;
      font-weight: bold;
    }
  }
  .weeks {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    border-bottom: 1px solid #d8d8d8;
    .day, .today {
      width: vw(50);
      font-size: 16px;
      position: relative;
      text-align: center;
      line-height: vw(50);
      box-sizing: border-box;
      .mark {
        top: 3px;
        right: 3px;
        width: 14px;
        font-size: 13px;
        color: #f66161;
        line-height: 14px;
        border-radius: 5px;
        position: absolute;
      }
    }
    .today {
      color: #fff;
      background-color: #8889f7;
    }
  }
}
</style>