<template>
  <div>
    <div v-if="$store.state.userid" class="page">
      <van-form>
        <van-field v-model="name" readonly class="input" label="姓名" />
        <van-field v-model="birthday" readonly class="input" label="出生年月日" right-icon="calender-o" />
        <van-field v-model="sex" readonly class="input" label="性别" />
        <van-field v-model="startDay" readonly class="input" label="开始日期" placeholder="年-月-日" right-icon="calender-o" />
        <van-field v-model="goods" readonly class="input" label="产品" />
        <van-field v-model="weeks" readonly class="input" label="有效周数" />
        <van-field v-model="endDay" readonly class="input" label="结束日期" right-icon="calender-o" />
        <van-field
          v-model="classes"
          readonly
          type="textarea"
          :autosize="true"
          class="input"
          label="选择课程"
        />
        <van-field v-model="payWay" readonly label="缴费性质" class="input" />
        <van-field v-model="introUser" readonly label="转介绍顾客" class="input" />
        <van-field v-model="presentClass" readonly class="input" label="获赠课程" />
        <van-field
          v-model="tel"
          readonly
          class="input"
          maxlength="11"
          label="电话号码"
          right-icon="phone-o"
        />
        <van-field v-model="equipment" readonly class="input" label="装备性质" />
        <van-field v-model="reallyMoney" required class="input" type="number" maxlength="6" label="缴费金额" placeholder="请输入缴费金额，单位元" />
        <van-field v-model="notice" clearable class="input" type="textarea" :autosize="true" maxlength="150" label="备注" placeholder="请输入备注" />
      </van-form>
      <div class="submit">
        <van-button round block type="info" @click="submitRes">提交</van-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Button, Form, Field } from 'vant'
  @Component({
    components: {
      [Button.name]: Button,
      [Form.name]: Form,
      [Field.name]: Field,
    }
  })
  export default class CheckMall extends Vue {
    private userid: string = null;
    private name: any = null;
    private birthday: any = null;
    private sex: string = null;
    private startDay: any = null;
    private weeks: any = null;
    private endDay: any = null;
    private tel: string = null;
    private payWay: any = null;
    private payWayId: any = null;
    private introUser: any = null;
    private introUserId: any = null;
    private presentClass: any = null;
    private goods: string = null;
    private goodsId: string = null;
    private equipment: string = null;
    private classes: string = null;
    private reallyMoney: string = null;
    private notice: string = '';
    private classIdList: any[] = [];
    private unloadTime: any = null;
    protected created(): void {
      if (!this.$store.state.userid) {
        const url = encodeURIComponent(location.href);
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0e734c0a8f759921&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo#wechat_redirect`;
      } else {
        this.getInfo();
      }
    }
    private async submitRes(): Promise<any> {
      const { weeks, name, birthday, sex, startDay, endDay, payWayId, tel, goodsId, equipment, classes, notice, reallyMoney, introUserId, presentClass, unloadTime, classIdList} = this;
      if (classes && reallyMoney) {
        this.$toast.loading({duration: 0});
        try {
          await this.$api({
            url: '/coursePayUser/updateCoursePayUserById',
            method: 'PUT',
            data: {
              id: this.$route.query.id,
              uname: name,
              birthday: birthday,
              stime: startDay,
              etime: endDay,
              paymenttype: payWayId,
              tel: tel,
              courseId: goodsId,
              week: weeks,
              quip: equipment,
              mark: notice,
              money: reallyMoney,
              payee: this.$store.state.userid,
              sex: sex === '男' ? 1 : 0,
              time: unloadTime,
              userid: this.userid,
              myuserid: this.userid,
              inviteUser: introUserId,
              giveCourse: presentClass,
              courseEtc: classIdList,
            },
            form: false,
          });
          this.$toast('提交成功');
          this.$router.push('/success');
        } catch (error) {
          this.$toast(error);
        }
      } else {
        this.$toast('请完善信息');
      }
    }
    private timeUtil(date: any): void {
      const e = new Date(date);
      const time: any = `${e.getFullYear()}-${e.getMonth() < 9 ? `0` : ``}${e.getMonth() + 1}-${e.getDate() < 10 ? `0` : ``}${e.getDate()}`;
      return time
    }
    private async getInfo(): Promise<any> {
      try {
        const { inviterName, course, entity, inviteName, paymenttypeName } = await this.$api({
          url: `/coursePayUser/findCoursePayUserById`,
          data: {
            id: this.$route.query.id
          }
        });
        const {
          birthday,
          courseEtc,
          courseId,
          etime,
          giveCourse,
          inviteUser,
          mark,
          money,
          myuserid,
          payee,
          paymenttype,
          quip,
          sex,
          stime,
          tel,
          time,
          userid,
          uname,
          week
        } = entity;
        this.name = uname;
        this.birthday = this.timeUtil(birthday);
        this.sex = (sex === 1 ? '男' : '女');
        this.startDay = this.timeUtil(stime);
        this.goods = course;
        this.goodsId = courseId;
        this.weeks = week;
        this.endDay = this.timeUtil(etime);
        courseEtc.forEach((e: any) => {
          this.classes += (`${e.addr} ${e.week} ${e.startTime}-${e.endTime} 组别:${e.groupName} 剩余:${e.allowpeples}\n`);
          this.classIdList.push({id: e.id});
        });
        this.payWay = paymenttypeName;
        this.payWayId = paymenttype;
        this.introUser = inviterName;
        this.introUserId = inviteUser;
        this.presentClass = giveCourse;
        this.equipment = quip;
        this.tel = tel;
        this.notice = mark;
        this.unloadTime = time;
        this.userid = userid;
        this.$store.commit('setLoadingStatus', false);
      } catch (error) {
        this.$toast(error);
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
    .submit {
      padding: 20px 80px 0 80px;
    }
  }
</style>
