<template>
  <div>
    <div class="page">
      <div class="add_wrapper">
        <van-icon class="add_btn" name="plus" size="24" @click="popType = 0;addShow = true" />
      </div>
      <div v-if="courseShow" class="course_wrapper">
        <div class="every_course" v-for="({infos, stage, title, trainTime}, index) in courseList" :key="index">
          <div class="short_lable">教学标题：{{title}}</div>
          <div class="short_lable">训练时长：{{trainTime}}</div>
          <div class="short_lable">训练道具：{{stage}}</div>
          <div>教学内容：{{infos}}</div>
          <div class="modify_btn" @click="modifyCourse(index)">修改</div>
          <div class="del_btn" @click="delCourse(index)">删除</div>
        </div>
      </div>
    </div>
    <van-popup v-model="addShow" round :close-on-click-overlay="false" style="height: 70%;width: 90%">
      <div class="add_box">
        <div class="title">{{popType === 0 ? '增加教案' : '修改教案'}}</div>
        <van-field v-model="teachingPlanId" label="教案编号" required />
        <van-field v-model="modelName" label="教案模板" placeholder="选择教案模板" readonly  @click="getModel" />
        <van-field v-model="modelTitle" label="教学标题" placeholder="请输入标题" />
        <van-field v-model="modelTime" label="教学时长" placeholder="请输入 例：15min" />
        <van-field v-model="modelGood" label="训练道具" placeholder="请输入" />
        <van-field
          v-model="modelContent"
          label="教学内容"
          placeholder="请输入"
          rows="3"
          autosize
          type="textarea"
          maxlength="50"
          show-word-limit
        />
        <van-field label="序号">
          <template #input>
            <van-stepper v-model="modelIndex" min="0" integer />
          </template>
        </van-field>
        <div class="btns">
          <div class="cancel" @click="clear">取消</div>
          <div class="submit" @click="addSubmit">确定</div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="modelShow" position="bottom" style="height: 50%">
      <van-picker
        title="选择教案模板"
        show-toolbar
        :columns="modelList"
        @confirm="chooseModel"
        @cancel="modelShow = false"
      />
    </van-popup>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Icon, Popup, Field, Picker, Stepper, Dialog } from 'vant'
  @Component({
    components: {
      [Icon.name]: Icon,
      [Popup.name]: Popup,
      [Field.name]: Field,
      [Picker.name]: Picker,
      [Stepper.name]: Stepper,
    }
  })
  export default class UploadCourse extends Vue {
    private courseList: any[] = [];
    private choose: number = 0;
    private addShow: boolean = false;
    private popType: number = null;
    private modelShow: boolean = false;
    private courseShow: boolean = false;
    private modelList: any[] = [];
    private modelObj: any[] = [];
    private modelName: string = '';
    private modelTitle: string = '';
    private modelTime: string = '';
    private modelGood: string = '';
    private modelContent: string = '';
    private modelIndex: number = 0;
    private modelId: number = null;
    private teachingPlanId: number = null; 
    private id: number = null;
    private coachId: number = null;

    protected created(): void {
      this.$store.commit('saveUserid', 64);
      this.getCourseList();
    }
    private chooseModel(model: any, index: number): void {
      const { id, infos, stage, title, train_time} = this.modelObj[index];
      this.modelName = title;
      this.modelTitle = title;
      this.modelGood = stage;
      this.modelContent = infos;
      this.modelTime = train_time;
      this.modelId = id;
      this.modelShow = false;
    }
    private async getCourseList(): Promise<any> {
      this.courseList = [];
      this.courseShow = false;
      if (!this.$store.state.loadingStatus) {
        this.$toast.loading();
      }
      try {
        const obj = await this.$api({
          url: '/teachingPlan/findTeachingPlan',
          data: {
            userid: this.$store.state.userid,
            courseId: this.$route.query.courseId
          }
        });
        this.courseList = obj.list;
        this.teachingPlanId = obj.id;
        this.coachId = obj.coach_id;
        this.courseShow = true;
        this.$store.commit('setLoadingStatus', false);
        this.$toast.clear();
      } catch(error) {
        this.$toast.fail(error);
      }
    }
    private async getModel(): Promise<any> {
      this.modelList = [];
      this.$toast.loading();
      try {
        const obj = await this.$api({
          url: '/teachingMudle/getTeachingMudle',
          method: 'get'
        });
        this.modelObj = obj;
        obj.forEach((e: any) => {
          this.modelList.push(e.title);
        });
        this.$toast.clear();
        this.modelShow = true;
      } catch(error) {
        this.$toast.fail(error);
      }
    }
    private async addSubmit(): Promise<any> {
      const { popType, modelName, modelTitle, modelGood, modelContent, modelTime, modelIndex, modelId, teachingPlanId, id, coachId } = this;
      const item = {
        coachId: coachId,
        id: id,
        infos: modelContent,
        sort: modelIndex,
        stage: modelGood,
        status: 1,
        teachingMudleId: modelId,
        teachingPlanId: teachingPlanId,
        title: modelTitle,
        trainTime: modelTime,
      }
      this.$toast.loading();
      try {
        if (popType === 0) { //新增
          // await this.$api({
          //   url: '/teachingPlanInfo/addTeachingPlanInfo',
          //   data: {
          //     teachingPlanId: teachingPlanId,
          //     teachingMudleId: modelId,
          //     coachId: coachId,
          //     title: modelTitle,
          //     stage: modelGood,
          //     infos: modelContent,
          //     sort: modelIndex,
          //     trainTime: modelTime,
          //     status: 1
          //   }
          // });
          for (const key in this.courseList) {
            if (this.courseList[Number(key)].sort > modelIndex) {
              this.courseList.splice(Number(key), 0, item);
            } else {
              this.courseList.splice(modelIndex, 0, item);
              break
            }
          }
          this.$toast('上传成功');
        } else { //修改
          await this.$api({
            url: '/teachingPlanInfo/updateTeachingPlanInfo',
            data: {
              id: id,
              teachingPlanId: teachingPlanId,
              teachingMudleId: modelId,
              coachId: coachId,
              title: modelTitle,
              stage: modelGood,
              infos: modelContent,
              sort: modelIndex,
              trainTime: modelTime,
              status: 1
            }
          });
        }
      } catch(error) {
        this.$toast.fail(error);
      }
      this.clear();
    }
    private clear(): void {
      this.addShow = false;
      this.modelName = '';
      this.modelTitle = '';
      this.modelTime = '';
      this.modelGood = '';
      this.modelContent = '';
      this.modelIndex = 0;
    }
    private async modifyCourse(index: number): Promise<any> {
      this.popType = 1;
      const { id, infos, stage, title, trainTime, teachingMudleId, sort } = this.courseList[index];
      this.modelName = this.modelTitle = title;
      this.modelGood = stage;
      this.modelContent = infos;
      this.modelTime = trainTime;
      this.modelId= teachingMudleId;
      this.modelIndex = sort;
      this.id = id;
      this.addShow = true;
    }
    private delCourse(index: number): void {
      const { id } = this.courseList[index];
      Dialog.confirm({
        title: '删除教案',
        message: '是否确认删除此教案',
      }).then( async() => {
        this.$toast.loading();
        try {
          const obj = await this.$api({
            url: '/teachingPlanInfo/deleteTeachingPlanInfo',
            data: {
              id: id
            }
          });
          this.$toast('删除成功');
          this.courseList.splice(index, 1);
        } catch(error) {
          this.$toast.fail(error);
        }
      })
      .catch(() => {
      });
    }
  }
</script>

<style lang="scss" scoped>
.page {
  padding: 37px 10px 0 10px;
  .add_wrapper {
    top: 0;
    right: 0;
    width: 100%;
    padding: 5px;
    position: fixed;
    text-align: right;
    background-color: #ececec;
  }
  .course_wrapper {
    .every_course {
      padding: 8px;
      border-radius: 8px;
      position: relative;
      margin-bottom: 8px;
      background-color: #fff;
      box-shadow: 3px 3px 3px #cccccc;
      .short_lable {
        max-width: 200px;
        margin-bottom: 3px;
      }
      .modify_btn, .del_btn {
        top: 5px;
        right: 55px;
        width: 40px;
        color: #fff;
        line-height: 25px;
        border-radius: 5px;
        text-align: center;
        position: absolute;
        background-color: #54cc49;
      }
      .del_btn {
        top: 5px;
        right: 5px;
        background-color: #d4352f;
      }
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