<template>
  <div>
    <div class="page">
      <div class="course_number">
        <span>课程编号：135</span>
        <van-icon class="add_btn" name="plus" size="24" @click="addShow = true" />
      </div>
      <div class="every_person">
        <span class="name">张三</span>
        <span>未确认是否到场</span>
        <div class="sign">签到</div>
      </div>
    </div>
    <van-popup v-model="addShow" round :close-on-click-overlay="false" style="height: 50%;width: 90%">
      <div class="add_box">
        <div class="title">新增上课学员</div>
        <van-field v-model="teachingPlanId" label="教案编号" readonly />
        <van-field v-model="studentName" label="学员姓名" placeholder="选择学员姓名" readonly @click="getStudent" />
        <div class="btns">
          <div class="cancel" @click="clear">取消</div>
          <div class="submit" @click="addSubmit">确定</div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="studentShow" position="bottom" style="height: 50%">
      <van-picker
        title="选择学员"
        show-toolbar
        :columns="studentList"
        @confirm="chooseStudent"
        @cancel="studentShow = false"
      />
    </van-popup>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Icon, Popup, Field, Picker } from 'vant'
  @Component({
    components: {
      [Icon.name]: Icon,
      [Popup.name]: Popup,
      [Field.name]: Field,
      [Picker.name]: Picker,
    }
  })
  export default class Sign extends Vue {
    private addShow: boolean = false;
    private studentShow: boolean = false;
    private choose: number = 0;
    private fold: any[] = [];
    private state: number = 0;
    private teachingPlanId: Number = 135;
    private studentName: string = '';
    private studentList: any[] = [];
    private size: number = 0;
    protected created(): void {
      this.$store.commit('saveUserid', 64);
      this.$store.commit('setLoadingStatus', false);
      // this.getList();
    }
    private async getList(): Promise<any> {
      this.$toast.loading();
      try {
        const obj = await this.$api({
          url: '/teachingPlan/findRectorListTp',
          data: {
            userid: this.$store.state.userid,
            size: this.size
          }
        });
        this.$toast.clear();
      } catch(error) {
        this.$toast.fail(error);
      }
    }
    private clear(): void {
      this.addShow = false;
    }
    private async addSubmit(): Promise<any> {

    }
    private async getStudent(): Promise<any> {
      this.studentShow = true;
    }
    private chooseStudent(): void {

    }
  }
</script>

<style lang="scss" scoped>
.page {
  padding: 30px 8px 8px 8px;
  .course_number {
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    display: flex;
    padding: 0 10px;
    font-size: 14px;
    color: #666666;
    line-height: 25px;
    position: absolute;
    align-items: center;
    background: #eeeeee;
    box-sizing: border-box;
    justify-content: space-between;
  }
  .every_person {
    display: flex;
    color: #999999;
    border-radius: 8px;
    padding: 15px 10px;
    align-items: center;
    background-color: #fff;
    justify-content: space-between;
    box-shadow: 3px 3px 3px #cccccc;
    .name {
      font-size: 14px;
    }
    .sign {
      padding: 0 15px;
      color: #333333;
      line-height: 26px;
      border-radius: 8px;
      background-color: #59e636;
    }
  }
}
.add_box {
  padding: 10px;
  .title {
    font-size: 16px;
    font-weight: bold;
  }
  .btns {
    display: flex;
    margin-top: 10px;
    align-items: center;
    justify-content: flex-end;
    .cancel, .submit {
      width: 50px;
      color: #333333;
      line-height: 30px;
      text-align: center;
      border-radius: 5px;
      background-color: #d8d8d8;
    }
    .submit  {
      color: #fff;
      margin-left: 10px;
      background-color: #367bfa;
    }
  }
}
</style>