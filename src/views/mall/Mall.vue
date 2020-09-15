<template>
  <div>
    <div v-if="$store.state.userid" class="page">
      <van-form>
        <van-field v-model="name" readonly class="input" maxlength="6" label="姓名" />
        <van-field v-model="birthday" readonly class="input" label="出生年月日" right-icon="calender-o" />
        <van-field v-model="sex" readonly required class="input" label="性别" placeholder="请选择性别" @click="showPicks(1)" />
        <van-field v-model="startDay" readonly required class="input" label="开始日期" placeholder="年-月-日" right-icon="calender-o" @click="showStartDay = true" />
        <van-field v-model="weeks" readonly required class="input" label="有效周数" placeholder="请先选择产品" />
        <van-field v-model="endDay" readonly class="input" label="结束日期" right-icon="calender-o" placeholder="请先选择开始日期和产品" />
        <van-field v-model="payWay" readonly required label="缴费性质" class="input" placeholder="请选择缴费性质" @click="showPicks(4)"/>
        <van-field v-model="introUser" readonly label="转介绍顾客" class="input" placeholder="请选择介绍的老顾客" @click="payWayId === 4 ? getIntroUser() : $toast('非老客转介绍')"/>
        <van-field v-model="presentClass" readonly class="input" label="获赠课程" placeholder="请填写老客获得赠送课程(节)" />
        <van-field
          v-model="tel"
          required
          clearable
          class="input"
          type="tel"
          maxlength="11"
          label="电话号码"
          right-icon="phone-o"
          placeholder="请输入电话号码"
          :rules="[{ pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确' }]"
        />
        <van-field v-model="goods" readonly required class="input" label="产品" placeholder="请选择产品" @click="startDay ? showPicks(2) : $toast('请先选择开始日期')" />
        <van-field v-model="equipment" readonly required class="input" label="装备性质" placeholder="请选择装备性质" @click="showPicks(3)" />
        <van-field v-model="notice" clearable class="input" type="textarea" :autosize="true" maxlength="150" label="备注" placeholder="请输入备注" />
        <van-field v-model="getMoneyPerson" readonly class="input" label="收款人" placeholder="请选择收款人" @click="showPicks(6)" />
        <van-field v-model="reallyMoney" required class="input" type="number" maxlength="6" label="实收费用" placeholder="请输入实际收费金额，单位元" />
        <van-field
          v-model="classes"
          readonly
          required
          type="textarea"
          :autosize="true"
          class="input"
          label="选课"
          placeholder="请选课"
          @click="birthday ? goods ? getClassList() : $toast('请选择产品') : $toast('请选择生日')"
        />
      </van-form>
      <div class="submit">
        <van-button round block type="info" @click="submitRes">提交</van-button>
      </div>
      <van-popup v-model="showStartDay" position="bottom">
        <van-datetime-picker
          v-model="currentStartDate"
          type="date"
          title="选择开始日期"
          :min-date="minStartDate"
          @confirm="chooseStartDay"
          @cancel="showStartDay = false"
        />
      </van-popup>
      <van-popup v-model="showPicker" position="bottom">
        <van-picker
          show-toolbar
          :columns="columns"
          @confirm="choosePicker"
          @cancel="showPicker === false"
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
  export default class Mall extends Vue {
    private showStartDay: boolean = false;
    private showPicker: boolean = false;
    private showPickClass: boolean = false;
    private pickIndex: number = null;
    private minStartDate: object = new Date();
    private currentStartDate: object = null;
    private name: any = null;
    private birthday: any = null;
    private sex: string = null;
    private startDay: string = null;
    private weeks: any = null;
    private endDay: string = null;
    private tel: string = null;
    private payWay: string = null;
    private introUser: any = null;
    private presentClass: any = null;
    private goods: string = null;
    private equipment: string = null;
    private classes: string = null;
    private payWayId: number = null;
    private introUserId: any = null;
    private notice: string = '';
    private getMoneyPerson: string = null;
    private getMoneyPersonId: string = null;
    private reallyMoney: string = null;
    private columns: any[] = [];
    private payWayList: any[] = [];
    private introUserList: any[] = [];
    private goodsList: any[] = [];
    private equipmentList: any[] = [];
    private getMoneyPersonList: any[] = [];
    private sexList: string[] = ['男', '女']; 
    private classesList: any[] = [];
    private classIdList: any[] = [];
    private myChooseClass: string[] = [];
    private myChooseClassId: any[] = [];
    private goodsIndex: number = null;
    private limitClassNum: number = null;
    protected created(): void {
      if (!this.$store.state.userid) {
        const url = encodeURIComponent(location.href);
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0e734c0a8f759921&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo#wechat_redirect`;
      } else {
        this.getGoodList();
        const { name, birthday, inviteName, giveCourse, inviteUser } = this.$route.query;
        this.name = name;
        this.birthday = birthday;
        this.introUser = inviteName;
        this.presentClass = giveCourse;
        this.introUserId = inviteUser;
      }
    }
    private async submitRes(): Promise<any> {
      const { name, birthday, sex, startDay, endDay, payWayId, tel, goods, equipment, classes, notice, goodsList, goodsIndex, myChooseClassId, reallyMoney, introUserId, presentClass, getMoneyPersonId} = this;
      if (sex && startDay && tel && goods && equipment && classes && reallyMoney) {
        this.$toast.loading({duration: 0});
        try {
          await this.$api({
            url: '/coursePayUser/buyCourse',
            data: {
              uname: name,
              birthday: birthday,
              stime: startDay,
              etime: endDay,
              paymenttype: payWayId,
              tel: tel,
              courseId: goodsList[goodsIndex].id,
              week: goodsList[goodsIndex].week,
              quip: equipment,
              mark: notice,
              money: reallyMoney,
              payee: getMoneyPersonId,
              sex: sex === '男' ? 1 : 2,
              userid: this.$route.query.userid,
              inviteUser: introUserId,
              giveCourse: presentClass.split(' ')[0],
              courseEtc: myChooseClassId,
              myuserid: this.$store.state.userid
            },
            form: false,
            headers: 'json',
          })
          this.$toast('提交成功');
          this.$router.push('/success');
        } catch (error) {
          this.$toast(error);
        }
      } else {
        this.$toast('请完善信息');
      }
    }
    private chooseStartDay(e: any): void {
      this.startDay = `${e.getFullYear()}-${e.getMonth() < 9 ? `0` : ``}${e.getMonth() + 1}-${e.getDate() < 10 ? `0` : ``}${e.getDate()}`;
      if (this.goods) this.getEndDay();
      this.showStartDay = false;
    }
    private showPicks(e: number): void {
      this.columns = [];
      this.pickIndex = e;
      if (e === 1) {
        this.columns = this.sexList;
      } else if (e === 2) {
        this.goodsList.forEach((e: any) => {
          this.columns.push(e.name);
        })
      } else if (e === 3) {
        this.columns = this.equipmentList;
      } else if (e === 4) {
        this.payWayList.forEach((e) => {
          this.columns.push(e.name);
        });
      } else if (e === 6) {
        this.getMoneyPersonList.forEach((e) => {
          this.columns.push(e.username);
        });
      }
      this.showPicker = true;
    }
    private choosePicker(e: any, index?: number): void {
      if (this.pickIndex === 1) {
        this.sex = e;
      } else if (this.pickIndex === 2) {
        this.goodsIndex = index;
        this.limitClassNum = this.goodsList[index].number;
        this.goods = e;
        this.weeks = this.goodsList[index].week;
        this.getEndDay();
      } else if (this.pickIndex === 3) {
        this.equipment = e;
      } else if (this.pickIndex === 4) {
        this.payWay = e;
        this.payWayId = this.payWayList[index].id;
        this.presentClass = `${this.payWayList[index].give_course} 节`;
      } else if (this.pickIndex === 5) {
        this.introUser = e;
        this.introUserId = this.introUserList[index].userid;
      } else {
        this.getMoneyPerson = e;
        this.getMoneyPersonId = this.getMoneyPersonList[index].user_id;
      }
      this.showPicker = false;
    }
    private getEndDay(): void {
      const arr = this.startDay.split('-');
      const year: any = Number(arr[0]) , month: any = Number(arr[1]), day: any = Number(arr[2]);
      const e = new Date(year, month, day + this.weeks * 7);
      this.endDay = `${e.getFullYear()}-${e.getMonth() < 9 ? `0` : ``}${e.getMonth() + 1}-${e.getDate() < 10 ? `0` : ``}${e.getDate()}`;
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
    private async getGoodList(): Promise<any> {
      try {
        const obj = await this.$api({
          url: '/courseMudle/findBuyCourseMudle',
          method: 'get'
        })
        this.goodsList = obj;
        this.getEquipmentList();
      } catch (error) {
        this.$toast(error);
      }
    }
    private async getEquipmentList(): Promise<any> {
      try {
        const obj = await this.$api({
          url: '/beeagleUsers/findQuipList',
          method: 'get'
        })
        obj.forEach((e: any) => {
          this.equipmentList.push(e.value);
        })
        this.getPay();
      } catch (error) {
        this.$toast(error);
      }
    }
    private async getPay(): Promise<any> {
      const obj = await this.$api({
        url: '/paymentType/findPaymentType',
        method: 'get',
      })
      this.payWayList = obj;
      this.getGetMoneyPerson();
    }
    private async getGetMoneyPerson(): Promise<any> {
      const obj = await this.$api({
        url: '/coursePayUser/findRector',
        method: 'get',
      })
      this.getMoneyPersonList = obj;
      this.$store.commit('setLoadingStatus', false);
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
          this.$toast(error);
        }
      } else {
        this.showPickClass = true;
      }
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
        this.pickIndex = 5;
        this.$toast.clear();
        this.showPicker = true;
      } catch (error) {
        this.$toast.fail(error);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    padding: 20px 10px;
    .input {
      margin-bottom: 20px;
    }
    .submit_btn {
      margin: 0 80px;
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
      padding: 20px 80px 0 80px;
    }
  }
</style>
