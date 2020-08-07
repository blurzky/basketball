<template>
  <div>
    <div class="page">
      <van-form>
        <van-field
          v-model="name"
          required
          label="学员姓名"
          maxlength="6"
          clearable
          class="input"
          placeholder="请输入学员姓名"
          :rules="[{ pattern: /^(?:[\u4e00-\u9fa5]+)(?:●[\u4e00-\u9fa5]+)*$|^[a-zA-Z0-9]+\s?[\.·\-()a-zA-Z]*[a-zA-Z]+$/, message: '姓名格式不正确' }]"
        />
        <van-field
          v-model="telNumber"
          required
          clearable
          label="家长手机号"
          right-icon="phone-o"
          class="input"
          type="tel"
          maxlength="11"
          placeholder="请输入家长手机号"
          :rules="[{ pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确' }]"
        />
        <van-field
          readonly
          required
          label="学员出生日期"
          right-icon="calender-o"
          :value="birthday"
          class="input"
          placeholder="年-月-日"
          @click="showBirth = true"
        />
        <van-field
          readonly
          required
          label="体验日期"
          right-icon="calender-o"
          :value="useday"
          class="input"
          placeholder="年-月-日"
          @click="showUseDay = true"
        />
        <van-field v-model="useWay" readonly required label="体验方式" class="input" placeholder="请选择体验方式" @click="showList(1)"/>
        <van-field v-model="usePlace" readonly required label="体验地点" class="input" placeholder="请选择体验地点" @click="showList(2)"/>
        <van-field v-model="schoolYear" readonly required label="在校年级" class="input" placeholder="请选择在校年级" @click="showList(3)"/>
        <van-popup v-model="showBirth" position="bottom">
          <van-datetime-picker
            v-model="currentDate"
            type="date"
            title="选择出生年月日"
            :min-date="minDate"
            :max-date="maxDate"
            @confirm="chooseBirth"
            @cancel="showBirth = false"
          />
        </van-popup>
        <van-popup v-model="showUseDay" position="bottom">
          <van-datetime-picker
            v-model="currentUseDate"
            type="date"
            title="选择体验日期"
            :min-date="minUseDate"
            @confirm="chooseUseDay"
            @cancel="showUseDay = false"
          />
        </van-popup>
        <van-popup v-model="showWay" position="bottom">
          <van-picker
            show-toolbar
            :columns="columns"
            @confirm="chooseWay"
            @cancel="showWay = false"
          />
        </van-popup>
      </van-form>
      <div class="submit">
        <van-button round block type="info" @click="submitRes">提交</van-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Button, DatetimePicker, Form, Field, Popup, Picker } from 'vant'
  @Component({
    components: {
      [Button.name]: Button,
      [DatetimePicker.name]: DatetimePicker,
      [Form.name]: Form,
      [Field.name]: Field,
      [Popup.name]: Popup,
      [Picker.name]: Picker,
    }
  })
  export default class TestClass extends Vue {
    private showBirth: boolean = false;
    private showUseDay: boolean = false;
    private showWay: boolean = false;
    private name: string = null;
    private telNumber: string = null;
    private birthday: string = null;
    private useday: string = null;
    private useWay: string = null;
    private usePlace: string = null;
    private schoolYear: string = null;
    private minDate: object = new Date(1980, 0, 1);
    private maxDate: object = null;
    private currentDate: object = null;
    private minUseDate: object = new Date();
    private currentUseDate: object = new Date();
    private listNum: number = null;
    private useWayId: string = null;
    private columns: any[] = [];
    private wayList: any[] = [];
    private placeList: any[] = [];
    private schoolYearList: any[] = [];
    protected created(): void {
      if (!this.$store.state.userid) {
        const url = encodeURIComponent(`${location.origin + location.pathname}`);
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf6b5696049ee6487&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo#wechat_redirect`;
      }
      this.getTime();
      this.getway();
    }
    private getTime(): void {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const day = today.getDate();
      this.maxDate = new Date(year - 3, month, day);
      this.currentDate = new Date(year - 3, month, day);
    }
    private async getway(): Promise<any> {
      try {
        const obj = await this.$api({
          url: '/courseMudle/findTrialCourseMudle',
          method: 'get',
        })
        this.wayList = obj;
        this.getPlace();
      } catch (error) {
        this.$toast.fail(`${error}`);
      }
    }
    private async getPlace(): Promise<any> {
      try {
        const obj = await this.$api({
          url: '/beeagleUsers/findAddrList',
          method: 'get',
        })
        this.placeList = obj;
        this.getYear();
      } catch (error) {
        this.$toast.fail(`${error}`);
      }
    }
    private async getYear(): Promise<any> {
      try {
        const obj = await this.$api({
          url: '/beeagleUsers/findGradeClassList',
          method: 'get',
        })
        this.schoolYearList = obj;
        this.$store.commit('setLoadingStatus', false);
      } catch (error) {
        this.$toast.fail(`${error}`);
      }
    }
    private chooseBirth(e: any) {
      this.showBirth = false;
      this.birthday = `${e.getFullYear()}-${e.getMonth() < 9 ? `0` : ``}${e.getMonth() + 1}-${e.getDate() < 10 ? `0` : ``}${e.getDate()}`
    }
    private chooseUseDay(e: any) {
      this.showUseDay = false;
      this.useday = `${e.getFullYear()}-${e.getMonth() < 9 ? `0` : ``}${e.getMonth() + 1}-${e.getDate() < 10 ? `0` : ``}${e.getDate()}`
    }
    private showList(e: number) {
      this.listNum = e;
      this.columns = [];
      if (e === 1) {
        this.wayList.forEach((e) => {
          this.columns.push(e.name)
        });
      } else if (e === 2) {
        this.placeList.forEach((e) => {
          this.columns.push(e.value)
        });
      } else {
        this.schoolYearList.forEach((e) => {
          this.columns.push(e.value)
        });
      }
      this.showWay = true;
    }
    private chooseWay(e: any, index: number) {
      if (this.listNum === 1) {
        this.useWay = e;
        this.useWayId = this.wayList[index].id;
      } else if (this.listNum === 2) {
        this.usePlace = e;
      } else {
        this.schoolYear = e;
      }
      this.showWay = false;
    }
    private submitRes() {
      const {name, telNumber, birthday, useday, useWayId, usePlace, schoolYear} = this;
      if (name && telNumber && birthday && useday && useWayId && usePlace && schoolYear) {
        this.$dialog.confirm({
          message: '您将提交您填写的信息，请确认',
          beforeClose: async (action, done) => {
            if (action === 'confirm') {
              try {
                const {message, status} = await this.$api({
                  url: '/courseTrial/applyCourseTrial',
                  form: false,
                  headers: 'json',
                  data: JSON.stringify({
                    addr: usePlace,
                    date: useday,
                    userid: this.$store.state.userid || '66',
                    courseMudleId: useWayId,
                    gradleClass: schoolYear,
                    rname: name,
                    tel: telNumber,
                    birthday: birthday,
                  })
                })
                done();
                this.$toast('提交成功');
              } catch (error) {
                done();
                this.$toast.fail(`${error}`);
              }
            } else {
              done();
            }
          },
        }).catch(() => {});
      } else {
        this.$toast.fail('请完善资料');
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    padding: 20px 12px;
    .title {
      font-size: 18px;
      letter-spacing: 2px;
      margin-bottom: 20px;
    }
    .input {
      margin-bottom: 20px;
    }
    .submit {
      padding: 20px 50px;
      text-align: center;
    }
  }
</style>
