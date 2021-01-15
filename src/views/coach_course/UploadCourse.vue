<template>
  <div>
    <div class="page">
      <div class="add_wrapper">
        <van-icon class="add_btn" name="plus" size="24" @click="popType = 0;addShow = true" />
      </div>
      <van-empty v-if="courseList.length === 0" description="点击右上角添加" />
      <div v-if="courseShow" class="course_wrapper">
        <div class="every_course" v-for="({url}, index) in courseList" :key="index">
          <div class="content">
            <span>文件 / 点击下载：</span>
            <span @click="download(url)" class="download_link">{{url}}</span>
          </div>
          <div class="btns">
            <div class="modify_btn" @click="modifyCourse(index)">修改</div>
            <div class="del_btn" @click="delCourse(index)">删除</div>
          </div>
        </div>
      </div>
    </div>
    <van-popup v-model="addShow" round :close-on-click-overlay="false" style="height: 27%;width: 90%">
      <div class="add_box">
        <div class="title">{{popType === 0 ? '增加教案' : '修改教案'}}</div>
        <van-field v-model="teachingPlanId" label="教案编号" required readonly />
        <van-field v-model="fileName" required readonly>
          <template #label>
            <van-uploader accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" :after-read="afterRead">
              <van-button icon="plus" type="info" size="mini">上传文件</van-button>
            </van-uploader>
          </template>
        </van-field>
        <div class="btns">
          <div class="cancel" @click="clear">取消</div>
          <div class="submit" @click="addSubmit">确定</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import axios from 'axios'
  import { Icon, Popup, Field, Dialog, Empty, Uploader, Button } from 'vant'
  @Component({
    components: {
      [Icon.name]: Icon,
      [Popup.name]: Popup,
      [Field.name]: Field,
      [Empty.name]: Empty,
      [Uploader.name]: Uploader,
      [Button.name]: Button,
    }
  })
  export default class UploadCourse extends Vue {
    private courseList: any[] = [];
    private addShow: boolean = false;
    private popType: number = null;
    private courseShow: boolean = false;
    private teachingPlanId: number = null; 
    private id: number = null;
    private coachId: number = null;
    private courseIndex: number = null;
    private fileName: string = '';
    private file: object = null;
    protected created(): void {
      this.getCourseList();
    }
    private afterRead(file: any): void {
      this.fileName = file.file.name;
      this.file = file.file;
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
    private async addSubmit(): Promise<any> {
      const { popType, teachingPlanId, id, coachId, file, courseIndex } = this;
      const data: any = new FormData();
      data.append('coachId', coachId);
      data.append('teachingPlanId', teachingPlanId);
      data.append('file', file);
      if (popType === 1) {
        data.append('id', id);
      }
      this.$toast.loading();
      if (file) {
        axios({
          method: 'post',
          url: popType === 0 ? '/api/teachingPlanInfo/addTeachingPlanInfo' : '/api/teachingPlanInfo/updateTeachingPlanInfo',
          data,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        })
        .then((res: any) => {
          const obj = res.data;
          if (popType === 0) {
            this.clear();
            this.$toast('上传成功');
            this.courseList.push(obj);
          } else {
            this.clear();
            this.$toast('修改成功');
            this.courseList[courseIndex].url = obj.url;
          }
        }).catch((error) => {
          this.$toast.fail(error);
        });
      } else {
        this.$toast('请完善信息');
      }
    }
    private clear(): void {
      this.addShow = false;
      this.file = null;
      this.fileName = null;
    }
    private async modifyCourse(index: number): Promise<any> {
      this.courseIndex = index;
      this.popType = 1;
      const { id, teachingMudleId } = this.courseList[index];
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
    private download(url: string): void {
      window.open(url, '_self');
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
    z-index: 200;
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
      .content {
        line-height: 20px;
      }
      .download_link {
        text-decoration: underline;
      }
      .btns {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .modify_btn, .del_btn {
          width: 40px;
          color: #fff;
          line-height: 25px;
          border-radius: 5px;
          text-align: center;
          background-color: #54cc49;
        }
        .del_btn {
          margin-left: 20px;
          background-color: #d4352f;
        }
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