<template>
  <div>
    <img src="./icon/bg.jpg" v-if="$store.state.userid" class="showcard"/>
    <div v-if="$store.state.userid" class="page">
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
        <!-- <van-field v-model="payWay" readonly required label="缴费性质" class="input" placeholder="请选择缴费性质" @click="showList(4)"/>
        <van-field v-model="introUser" readonly label="转介绍顾客" class="input" placeholder="请选择介绍的老顾客" @click="payWayId === 4 ? getIntroUser() : $toast('非老客转介绍')"/>
        <van-field
          v-model="classes"
          readonly
          required
          type="textarea"
          :autosize="true"
          class="input"
          label="选课"
          placeholder="请选课"
          @click="birthday ? useWay ? getClassList() : $toast('请选择体验方式') : $toast('请选择生日')"
        /> -->
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
        <van-popup v-model="showPickClass" class="check_popup" position="bottom" :style="{ height: '50%' }">
          <van-checkbox-group v-model="myChooseClass" :max="limitClassNum">
            <van-checkbox v-for="(item, index) in classesList" :key="index" :name="index" class="check_box">{{item}}</van-checkbox>
          </van-checkbox-group>
          <div class="choose_btn">
            <van-button type="info" round size="small" :style="{width: `80px`}" @click="chooseClass">确认</van-button>
          </div>
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
  import { Button, DatetimePicker, Form, Field, Popup, Picker, Checkbox, CheckboxGroup } from 'vant'
  @Component({
    components: {
      [Button.name]: Button,
      [DatetimePicker.name]: DatetimePicker,
      [Form.name]: Form,
      [Field.name]: Field,
      [Popup.name]: Popup,
      [Picker.name]: Picker,
      [Checkbox.name]: Checkbox,
      [CheckboxGroup.name]: CheckboxGroup,
    }
  })
  export default class TestClass extends Vue {
    private showBirth: boolean = false;
    private showUseDay: boolean = false;
    private showWay: boolean = false;
    private showPickClass: boolean = false;
    private name: string = null;
    private telNumber: string = null;
    private birthday: string = null;
    private useday: string = null;
    private useWay: string = null;
    private usePlace: string = null;
    private schoolYear: string = null;
    private payWay: string = null;
    private introUser: string = null;
    private classes: string = null;
    private minDate: object = new Date(1980, 0, 1);
    private maxDate: object = null;
    private currentDate: object = null;
    private minUseDate: object = new Date();
    private currentUseDate: object = new Date();
    private listNum: number = null;
    private useWayId: string = null;
    private payWayId: number = null;
    private introUserId: string = null;
    private columns: any[] = [];
    private wayList: any[] = [];
    private placeList: any[] = [];
    private schoolYearList: any[] = [];
    private payWayList: any[] = [];
    private introUserList: any[] = [];
    private classesList: any[] = [];
    private classIdList: any[] = [];
    private myChooseClass: string[] = [];
    private myChooseClassId: any[] = [];
    private limitClassNum: number = null;
    protected created(): void {
      if (!this.$store.state.userid) {
        const url = encodeURIComponent(`${location.origin + location.pathname}?inviteUser=${this.$route.query.inviteUser}`);
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0e734c0a8f759921&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo#wechat_redirect`;
      } else {
        this.getTime();
        Promise.all([
          this.getway(),
          this.getPlace(),
          this.getYear()
        ]).then(() => {
          this.$store.commit('setLoadingStatus', false);
        }).catch(error => {
          this.$toast.fail(`${error}`);
        });
      }
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
      const obj = await this.$api({
        url: '/courseMudle/findTrialCourseMudle',
        method: 'get',
      })
      this.wayList = obj;
    }
    private async getPlace(): Promise<any> {
      const obj = await this.$api({
        url: '/beeagleUsers/findAddrList',
        method: 'get',
      })
      this.placeList = obj;
    }
    private async getYear(): Promise<any> {
      const obj = await this.$api({
        url: '/beeagleUsers/findGradeClassList',
        method: 'get',
      })
      this.schoolYearList = obj;
    }
    private async getPay(): Promise<any> {
      const obj = await this.$api({
        url: '/paymentType/findPaymentType',
        method: 'get',
      })
      this.payWayList = obj;
    }
    private async getIntroUser(): Promise<any> {
      this.$toast.loading();
      try {
        const obj = await this.$api({
          url: '/beeagleUsers/findBeaagleUsers',
          method: 'get',
        })
        this.introUserList = obj;
        this.columns = [];
        obj.forEach((e: any) => {
          this.columns.push(`${e.uname}${e.rname ? `【`+e.rname+`】` : ``}`);
        })
        this.listNum = 5;
        this.$toast.clear();
        this.showWay = true;
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
      } else if (e === 3)  {
        this.schoolYearList.forEach((e) => {
          this.columns.push(e.value)
        });
      } else if (e === 4) {
        this.payWayList.forEach((e) => {
          this.columns.push(e.name)
        });
      }
      this.showWay = true;
    }
    private chooseWay(e: any, index: number) {
      if (this.listNum === 1) {
        this.useWay = e;
        this.limitClassNum = this.wayList[index].number;
        this.useWayId = this.wayList[index].id;
      } else if (this.listNum === 2) {
        this.usePlace = e;
      } else if (this.listNum === 3) {
        this.schoolYear = e;
      } else if (this.listNum === 4) {
        this.payWay = e;
        this.payWayId = this.payWayList[index].id;
      } else {
        this.introUser = e;
        this.introUserId = this.introUserList[index].userid;
      }
      this.showWay = false;
    }
    private chooseClass(): void {
      this.showPickClass = false;
      this.classes = '';
      this.myChooseClassId = [];
      this.myChooseClass.forEach((e: any) => {
        this.classes += this.classesList[e];
        this.myChooseClassId.push({id: this.classIdList[e]});
      })
    }
    private async getClassList(): Promise<any> {
      if (!this.classesList.length) {
        this.$toast.loading({duration: 0});
        try {
          const obj = await this.$api({
            url: `/courseEtc/findRemaCourseByBirthDay?birthday=${this.birthday}`,
            method: 'get'
          })
          obj.forEach((e: any) => {
            this.classesList.push(`${e.addr} ${e.week} ${e.startTime}-${e.endTime} 组别:${e.groupName} 剩余:${e.allowpeples}\n`);
            this.classIdList.push(e.id);
          })
          this.$toast.clear();
          this.showPickClass = true;
        } catch (error) {
          this.$toast(`${error}`);
        }
      } else {
        this.showPickClass = true;
      }
    }
    private submitRes() {
      const {name, telNumber, birthday, useday, useWayId, usePlace, schoolYear, myChooseClassId, payWayId, introUserId} = this;
      if (name && telNumber && birthday && useday && useWayId && usePlace && schoolYear) { // && myChooseClassId && payWayId
        if (payWayId === 4 && !introUserId) {
          this.$toast.fail('老客转介绍请选择介绍人');
        } else {
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
                      userid: this.$store.state.userid,
                      courseMudleId: useWayId,
                      gradleClass: schoolYear,
                      rname: name,
                      tel: telNumber,
                      birthday: birthday,
                      courseEtc: myChooseClassId,
                      inviteUser: this.$route.query.inviteUser, // introUserId
                      paymenttype: payWayId,
                    })
                  })
                  done();
                  this.$toast('提交成功');
                  this.$router.push('/success')
                } catch (error) {
                  done();
                  this.$toast.fail(`${error}`);
                }
              } else {
                done();
              }
            },
          }).catch(() => {});
        }
      } else {
        this.$toast.fail('请完善资料');
      }
    }
  }
</script>

<style lang="scss" scoped>
  .showcard {
    width: 100%;
    height: vw(250);
    object-fit: cover;
  }
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
    .check_popup {
      padding: 20px;
      box-sizing: border-box;
      .check_box {
        margin-bottom: 20px;
      }
      .choose_btn {
        width: 100%;
        text-align: center;
      }
    }
    .submit {
      padding: 20px 50px;
      text-align: center;
    }
  }
</style>
