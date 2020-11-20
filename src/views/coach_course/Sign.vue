<template>
  <div>
    <div class="page">
      <div class="course_number">
        <span>课程编号：{{courseId}}</span>
        <van-icon class="add_btn" name="plus" size="24" @click="addShow = true" />
      </div>
      <div v-for="({uname, state, courseId, id, userid}, index) in objList" :key="index" class="every_person">
        <span class="name">{{uname}}</span>
        <!-- <span>{{remark}}</span> -->
        <span>{{ state | setState}}</span>
        <div class="sign" :class="state === 2 ? 'has_sign' : ''" @click="state !== 2 && signCk(courseId, id, userid, index)">
          签到
        </div>
      </div>
    </div>
    <van-popup v-model="addShow" round :close-on-click-overlay="false" style="height: 40%;width: 90%">
      <div class="add_box">
        <div class="title">新增上课学员</div>
        <van-field v-model="courseId" label="教案编号" readonly />
        <van-field v-model="studentName" label="学员姓名" placeholder="选择学员姓名" readonly @click="getStudent" />
        <van-field
          v-model="notice"
          label="备注信息"
          placeholder="请输入"
          rows="3"
          autosize
          type="textarea"
        />
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
        :columns="nameList"
        @confirm="chooseStudent"
        @cancel="studentShow = false"
      />
    </van-popup>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Icon, Popup, Field, Picker, Dialog } from 'vant'
  @Component({
    components: {
      [Icon.name]: Icon,
      [Popup.name]: Popup,
      [Field.name]: Field,
      [Picker.name]: Picker,
    },
    filters: {
      setState(state: number) {
        if (state === 1) {
          return '未确认是否到场'
        } else if (state === 2) {
          return '已签到'
        } else if (state === 2) {
          return '不能到场'
        } else {
          return '确认可以到场'
        }
      }
    }
  })
  export default class Sign extends Vue {
    private addShow: boolean = false;
    private studentShow: boolean = false;
    private fold: any[] = [];
    private state: number = 0;
    private courseId: Number = null;
    private studentName: string = '';
    private nameList: any[] = [];
    private studentList: any[] = [];
    private studentIndex: number = null;
    private objList: any[] = [];
    private notice: string = '';
    private size: number = 0;
    protected created(): void {
      this.courseId = Number(this.$route.query.courseId);
      this.getList();
    }
    private async getList(): Promise<any> {
      if (!this.$store.state.loadingStatus) {
        this.$toast.loading();
      }
      try {
        const obj = await this.$api({
          url: '/course/findStudentByCourseId',
          data: {
            courseId: this.courseId
          }
        });
        this.objList = obj;
        this.$store.commit('setLoadingStatus', false);
        this.$toast.clear();
      } catch(error) {
        this.$toast.fail(error);
      }
    }
    private clear(): void {
      this.studentName = '';
      this.notice = '';
      this.addShow = false;
    }
    private async getStudent(): Promise<any> {
      this.$toast.loading();
      try {
        const obj = await this.$api({
          url: `/courseStudent/findCourseStudens?courseId=${this.courseId}`,
          method: 'get'
        });
        this.studentList = obj;
        obj.forEach((e: any) => {
          this.nameList.push(`${e.uname}【${e.rname}】`);
        });
        this.studentShow = true;
        this.$toast.clear();
      } catch(error) {
        this.$toast.fail(error);
      }
    }
    private signCk(courseId: number, id: number, userid: string, index: number): void{
      console.log(courseId, id, userid)
       Dialog.confirm({
        title: '签到',
        message: '是否确认签到',
      }).then( async() => {
        this.$toast.loading();
        try {
          const obj = await this.$api({
            url: `/course/confirmCourseStudent`,
            data: {
              courseId: courseId,
              studentId: id,
              userid: userid
            }
          });
          this.objList[index].state = 2;
          this.$toast('签到成功');
        } catch(error) {
          this.$toast.fail(error);
        }
      })
      .catch(() => {
      });
    }
    private async addSubmit(): Promise<any> {
      const {userid, uname} = this.studentList[this.studentIndex];
      this.$toast.loading();
      try {
        const obj = await this.$api({
          url: `/courseStudent/addCourseStudent`,
          data: {
            courseId: this.courseId,
            userid: userid,
            uname: uname,
            state: 2,
            remark: this.notice
          }
        });
        this.objList = [];
        this.getList();
        this.$toast('增加成功');
      } catch(error) {
        this.$toast.fail(error);
      }
      this.addShow = false;
    }
    private chooseStudent(e: any, index: number): void {
      this.studentName = e;
      this.studentIndex = index;
      this.studentShow = false;
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
    margin-bottom: 8px;
    padding: 15px 10px;
    align-items: center;
    background-color: #fff;
    justify-content: space-between;
    box-shadow: 3px 3px 3px #cccccc;
    .name {
      font-size: 14px;
    }
    .sign {
      color: #000;
      padding: 0 15px;
      line-height: 26px;
      border-radius: 8px;
      background-color: #73dd58;
    }
    .has_sign {
      color: #fff;
      background-color: #999999;
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