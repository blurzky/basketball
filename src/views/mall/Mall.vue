<template>
  <div>
    <div class="page" v-if="$store.state.userid">
      <van-form>
        <van-field
          v-model="name"
          required
          clearable
          class="input"
          maxlength="6"
          label="姓名"
          placeholder="请输入姓名"
          :rules="[{ pattern: /^(?:[\u4e00-\u9fa5]+)(?:●[\u4e00-\u9fa5]+)*$|^[a-zA-Z0-9]+\s?[\.·\-()a-zA-Z]*[a-zA-Z]+$/, message: '姓名格式不正确' }]"
        />
        <van-field
          v-model="birthday"
          readonly
          required
          class="input"
          label="出生年月日"
          placeholder="年-月-日"
          right-icon="calender-o"
          @click="showBirth = true"
        />
        <van-field
          v-model="sex"
          readonly
          required
          class="input"
          label="性别"
          placeholder="请选择性别"
          @click="showPicks(1)"
        />
        <van-field
          v-model="startDay"
          readonly
          required
          class="input"
          label="开始日期"
          placeholder="年-月-日"
          right-icon="calender-o"
          @click="showStartDay = true"
        />
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
        <van-field
          v-model="goods"
          readonly
          required
          class="input"
          label="产品"
          placeholder="请选择产品"
          @click="showPicks(2)"
        />
        <van-field
          v-model="equipment"
          readonly
          required
          class="input"
          label="装备性质"
          placeholder="请选择装备性质"
          @click="showPicks(3)"
        />
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
        <van-field
          v-model="notice"
          clearable
          class="input"
          type="textarea"
          :autosize="true"
          maxlength="150"
          label="备注"
          placeholder="请输入备注"
        />
      </van-form>
      <div class="submit">
        <van-button round block type="info" @click="submitRes">提交</van-button>
      </div>
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
    private showBirth: boolean = false;
    private showStartDay: boolean = false;
    private showPicker: boolean = false;
    private showPickClass: boolean = false;
    private pickIndex: number = null;
    private minDate: object = new Date(1980, 0, 1);
    private maxDate: object = null;
    private currentDate: object = null;
    private minStartDate: object = new Date();
    private currentStartDate: object = null;
    private name: string = null;
    private birthday: string = null;
    private sex: string = null;
    private startDay: string = null;
    private tel: string = null;
    private goods: string = null;
    private equipment: string = null;
    private classes: string = null;
    private notice: string = '';
    private columns: any[] = [];
    private goodsList: any[] = [];
    private equipmentList: any[] = [];
    private sexList: string[] = ['男', '女'];
    private classesList: any[] = [];
    private classIdList: any[] = [];
    private myChooseClass: string[] = [];
    private myChooseClassId: any[] = [];
    private goodsIndex: number = null;
    private limitClassNum: number = null;
    protected created(): void {
      if (!this.$store.state.userid) {
        const url = encodeURIComponent(`${location.origin + location.pathname}`);
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf6b5696049ee6487&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo#wechat_redirect`;
      }
      this.getTime();
      this.getGoodList();
    }
    private async submitRes(): Promise<any> {
      const { name, birthday, sex, startDay, tel, goods, equipment, classes, notice, goodsList, goodsIndex, myChooseClassId} = this;
      if (name && birthday && sex && startDay && tel && goods && equipment && classes) {
        this.$toast.loading({duration: 0});
        try {
          await this.$api({
            url: '/coursePayUser/buyCourse',
            data: {
              userid: this.$store.state.userid,
              uname: name,
              birthday: birthday,
              stime: startDay,
              tel: tel,
              courseId: goodsList[goodsIndex].id,
              week: goodsList[goodsIndex].week,
              quip: equipment,
              mark: notice,
              sex: sex === '男' ? 1 : 2,
              courseEtc: myChooseClassId
            },
            form: false,
            headers: 'json',
          })
          this.$toast('提交成功');;
        } catch (error) {
          this.$toast(`${error}`);
        }
      } else {
        this.$toast('请完善信息');
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
    private chooseBirth(e: any): void {
      this.birthday = `${e.getFullYear()}-${e.getMonth() < 9 ? `0` : ``}${e.getMonth() + 1}-${e.getDate() < 10 ? `0` : ``}${e.getDate()}`;
      this.showBirth = false;
    }
    private chooseStartDay(e: any): void {
      this.startDay = `${e.getFullYear()}-${e.getMonth() < 9 ? `0` : ``}${e.getMonth() + 1}-${e.getDate() < 10 ? `0` : ``}${e.getDate()}`;
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
      } else {
        this.equipment = e;
      }
      this.showPicker = false;
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
        this.$toast(`${error}`);
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
        this.$store.commit('setLoadingStatus', false);
      } catch (error) {
        this.$toast(`${error}`);
      }
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
