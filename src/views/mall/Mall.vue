<template>
  <div>
    <custom-nav title="购买" border-color="#dbdbdb" />
    <div class="page">
      <van-form>
        <van-field
          v-model="name"
          required
          class="input"
          label="姓名"
          placeholder="请输入姓名"
        />
        <van-field
          v-model="birthday"
          readonly
          required
          class="input"
          label="出生年月日"
          placeholder="年-月-日"
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
          @click="showStartDay = true"
        />
        <van-field
          v-model="tel"
          required
          class="input"
          label="电话号码"
          placeholder="请输入电话号码"
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
          class="input"
          label="选课"
          placeholder="请选课"
          @click="showPickClass = true"
        />
      </van-form>
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
           @confirm="chooseBirth"
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
      <van-popup v-model="showPickClass" class="check_popup" position="bottom" :style="{ height: '35%' }">
        <van-checkbox-group v-model="myChooseClass">
          <van-checkbox name="a" class="check_box">复选框 a</van-checkbox>
          <van-checkbox name="b" class="check_box">复选框 b</van-checkbox>
        </van-checkbox-group>
        <van-button type="info" round size="small" class="choose_btn" @click="chooseClass">确认</van-button>
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
    private columns: any[] = [];
    private goodsList: any[] = [];
    private equipmentList: any[] = [];
    private sexList: string[] = ['男', '女'];
    private classesList: any[] = [];
    private myChooseClass: string[] = ['a', 'b'];
    protected created(): void {
      this.getTime();
      // this.getGoodList();
          this.$store.commit('setLoadingStatus', false);
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
      console.log(e);
      this.birthday = `${e.getFullYear()}-${e.getMonth() < 9 ? `0` : ``}${e.getMonth() + 1}-${e.getDate() < 9 ? `0` : ``}${e.getDate()}`
      this.showBirth = false;
    }
    private showPicks(e: number): void {
      if (e === 1) {
        this.columns = this.sexList;
      } else if (e === 2) {
        this.columns = this.goodsList;
      } else if (e === 3) {
        this.columns = this.equipmentList;
      }
      this.showPicker = true;
    }
    private choosePicker(e: any): void {
      console.log(e);
      this.showPicker = false;
    }
    private chooseClass(): void {
      console.log(this.myChooseClass);
      this.showPickClass = false;
    }
    private async getGoodList(): Promise<any> {
      try {
        const obj = await this.$api({
          url: 'courseMudle/findBuyCourseMudle',
          method: 'get'
        })
        this.$store.commit('setLoadingStatus', false);
      } catch (error) {
        this.$toast(`${error}`);
      }
    }
    private async getClassList(): Promise<any> {
      if (this.birthday) {
        try {
          const obj = await this.$api({
            url: `courseEtc/findRemaCourseByBirthDay${this.birthday}`,
            method: 'get'
          })
        } catch (error) {
          this.$toast(`${error}`);
        }
      } else {
        this.$toast(`请填写生日`);
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
    .check_popup {
      padding: 20px;
      box-sizing: border-box;
      .check_box {
        margin-bottom: 20px;
      }
      .choose_btn {
        width: 80px;
      }
    }
  }
</style>
