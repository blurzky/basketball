<template>
  <div>
    <div class="page">
      <van-form>
        <van-field
          v-model="nickname"
          label="昵称"
          maxlength="10"
          clearable
          class="input"
          placeholder="请输入昵称"
        />
        <van-field
          readonly
          label="孩子生日"
          :value="birthday"
          class="input"
          placeholder="年-月-日"
          @click="showBirth = true"
        />
        <van-field
          v-model="telNumber"
          clearable
          label="电话号码"
          class="input"
          type="tel"
          maxlength="11"
          placeholder="请输入家电话号码"
          :rules="[{ pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确' }]"
        />
        <van-field
          v-model="realname"
          label="孩子姓名"
          maxlength="10"
          clearable
          class="input"
          placeholder="请输入孩子姓名"
          :rules="[{ pattern: /^(?:[\u4e00-\u9fa5]+)(?:●[\u4e00-\u9fa5]+)*$|^[a-zA-Z0-9]+\s?[\.·\-()a-zA-Z]*[a-zA-Z]+$/, message: '姓名格式不正确' }]"
        />
        <van-field
          readonly
          v-model="grade"
          label="年级"
          class="input"
          placeholder="请选择年级"
          @click="showList()"
        />
        <van-cell title="性别">
          <template #right-icon>
            <van-radio-group v-model="sex" class="sex">
              <van-radio name="1" style="marginRight: 20px">男</van-radio>
              <van-radio name="0">女</van-radio>
            </van-radio-group>
          </template>
        </van-cell>
      </van-form>
      <div class="submit">
        <div class="btn" @click="submitRes">保存</div>
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
      <van-popup v-model="showWay" position="bottom">
          <van-picker
            show-toolbar
            :columns="columns"
            @confirm="chooseWay"
            @cancel="showWay = false"
          />
        </van-popup>
    </div>
  </div>
</template>


<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Form, Button, Field, DatetimePicker, Popup, RadioGroup, Radio, Cell, Picker } from 'vant'
  @Component({
    components: {
      [Button.name]: Button,
      [Field.name]: Field,
      [Form.name]: Form,
      [DatetimePicker.name]: DatetimePicker,
      [Popup.name]: Popup,
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio,
      [Cell.name]: Cell,
      [Picker.name]: Picker,
    }
  })
  export default class FillMine extends Vue {
    private nickname: any = '';
    private telNumber: any = '';
    private birthday: any = '';
    private currentDate: object = null;
    private realname: any = '';
    private grade: any = '';
    private sex: any = '';
    private columns: any[] = [];
    private gradeList: any[] = [];
    private minDate: object = new Date(1999, 0, 1);
    private maxDate: object = null;
    private showBirth: boolean = false;
    private showWay: boolean = false;
    protected created(): void {
      const { uname, tel, rname, sex, grade, birthday} = this.$route.query;
      this.nickname = uname;
      this.telNumber = tel;
      this.realname = rname;
      this.sex = sex;
      this.grade = grade;
      this.birthday = birthday;
      this.getTime();
      this.getYear();
    }
    private getTime(): void {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const day = today.getDate();
      this.maxDate = new Date(year - 3, month, day);
      this.currentDate = new Date(this.birthday || this.maxDate);
    }
    private async getYear(): Promise<any> {
      try {
        const obj = await this.$api({
          url: '/beeagleUsers/findGradeClassList',
          method: 'get',
        });
        this.gradeList = obj;
        this.$store.commit('setLoadingStatus', false);
      } catch (error) {
        this.$toast(error);
      }
    }
    private chooseBirth(e: any) {
      this.showBirth = false;
      this.birthday = `${e.getFullYear()}-${e.getMonth() < 9 ? `0` : ``}${e.getMonth() + 1}-${e.getDate() < 10 ? `0` : ``}${e.getDate()}`
    }
    private showList(e: number) {
      this.gradeList.forEach((e) => {
        this.columns.push(e.value);
      });
      this.showWay = true;
    }
    private chooseWay(e: any, index: number) {
      this.grade = e;
      this.showWay = false;
    }
    private async submitRes(): Promise<any> {
      this.$toast.loading();
      try {
        const { nickname, telNumber, realname, sex, grade, birthday} = this;
        await this.$api({
          url: '/beeagleUsers/updateUserInfo',
          form: false,
          data: {
            userid: this.$store.state.userid,
            uname: nickname,
            tel: telNumber,
            rname: realname,
            childSex: sex,
            gradeClass: grade,
            birthday: birthday
          }
        });
        this.$toast('保存成功');
        this.$router.go(-1);
      } catch (error) {
        this.$toast(error);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    background-color: #ececec;
    /deep/ .van-field__label, .van-cell__title {
      font-weight: bold;
    }
    .sex {
      display: flex;
      width: vw(244.2);
      align-items: center;
      justify-content: flex-start;
    }
    .submit {
      padding: 50px 80px;
      .btn {
        color: #fff;
        line-height: 45px;
        text-align: center;
        background: center / cover;
        border-radius: 30px;font-size: 14px;
        background-image: url('./icon/图层 17@2x.png');
      }
    }
  }
</style>