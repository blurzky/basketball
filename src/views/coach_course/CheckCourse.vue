<template>
  <div>
    <div class="page">
      <div v-for="({addr, coach_name, date, end_time, start_time, week, people, list, courseId, coach_id, tpState}, index) in objList" :key="index" class="coach_course">
        <div class="top_info">
          <div class="evrey_info">
            <div class="label">教练：<span class="coach_name">{{coach_name}}</span></div>
            <div class="label">地址：{{addr}}</div>
            <div>上课人数：{{people}}人</div>
          </div>
          <div class="evrey_info">
            <div class="label">课程编号：{{courseId}}</div>
            <div class="label">{{date}} {{week}}</div>
            <div>{{start_time}} ~ {{end_time}}</div>
          </div>
          <div class="evrey_info" style="width: 25%">
            <div v-if="tpState === 2">
              <div class="has_check">已审核</div>
              <div class="sign_person" @click="$router.push(`/sign?courseId=${courseId}`)">签到学员</div>
            </div>
            <div v-else>
              <div class="pass_btn" @click="pass(index)">通过</div>
              <div class="reject_btn" @click="dialogShow = true;listIndex = index">驳回</div>
            </div>
          </div>
        </div>
        <van-collapse v-if="list.length" v-model="fold">
          <van-collapse-item title="教学内容" :name="index">
            <div v-for="({url}, index) in list" :key="index" class="every_corse">
              <div>文件 / 点击下载：</div>
              <span @click="download(url)" class="download_link">{{url}}</span>
              <div class="sort">{{index + 1}}</div>
            </div>
          </van-collapse-item>
        </van-collapse>
        <div v-else class="no_flod">
          <div class="content">教学内容</div>
          <div class="no_upload">暂未上传教案</div>
          <div class="notice" @click="noticeCoach(courseId, coach_id)">提醒教练</div>
        </div>
      </div>
      <van-dialog
        v-model="dialogShow"
        title="驳回"
        show-cancel-button
        @confirm="reject"
        @cancel="mark='';dialogShow=false"
      >
        <van-field
          v-model="mark"
          label="驳回信息"
          placeholder="请输入"
          rows="3"
          type="textarea"
        />
      </van-dialog>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Icon, Collapse, CollapseItem, Dialog, Field } from 'vant'
  @Component({
    components: {
      [Icon.name]: Icon,
      [Collapse.name]: Collapse,
      [CollapseItem.name]: CollapseItem,
      [Dialog.Component.name]: Dialog.Component,
      [Field.name]: Field,
    }
  })
  export default class CheckCourse extends Vue {
    private dialogShow: boolean = false;
    private choose: number = 0;
    private fold: any[] = [];
    private objList: any[] = [];
    private size: number = 0;
    private mark: string = '';
    private listIndex: number = null;
    protected created(): void {
      this.getList();
    }
    private async getList(): Promise<any> {
      if (!this.$store.state.loadingStatus) {
        this.$toast.loading();
      }
      try {
        const obj = await this.$api({
          url: '/teachingPlan/findRectorListTp',
          data: {
            userid: this.$store.state.userid,
            size: this.size
          }
        });
        this.objList = obj;
        this.$store.commit('setLoadingStatus', false);
        this.$toast.clear();
      } catch(error) {
        this.$toast.fail(error);
      }
    }
    private pass(index: number): void {
      const {courseId, coach_id, tpId} = this.objList[index];
      Dialog.confirm({
        title: '通过',
        message: '是否确认通过',
      }).then( async() => {
        this.$toast.loading();
        try {
          await this.$api({
            url: '/teachingPlan/auditTeachingPlan',
            data: {
              courseId: courseId,
              coachId: coach_id,
              id: tpId,
              state: 2,
              mark: '',
            }
          });
          this.objList[index].tpState = 2;
          this.$toast('通过成功');
        } catch(error) {
          this.$toast.fail(error);
        }
      })
      .catch(() => {
      });
    }
    private async reject(): Promise<any> {
      const {courseId, coach_id, tpId} = this.objList[this.listIndex];
      this.$toast.loading();
      try {
        await this.$api({
          url: '/teachingPlan/auditTeachingPlan',
          data: {
            courseId: courseId,
            coachId: coach_id,
            id: tpId,
            state: 3,
            mark: this.mark,
          }
        });
        this.objList[this.listIndex].tpState = 3;
        this.$toast('驳回成功');
      } catch(error) {
        this.$toast.fail(error);
      }
    }
    private async noticeCoach(courseId: number, coachId: number): Promise<any> {
      this.$toast.loading();
      try {
        const obj = await this.$api({
          url: '/teachingPlan/remindCoach',
          data: {
            courseId: courseId,
            coachId: coachId
          }
        });
        this.$toast('提醒成功');
      } catch(error) {
        this.$toast.fail(error);
      }
    }
    private download(url: string): void {
      window.open(url, '_self');
    }
  }
</script>

<style lang="scss" scoped>
.page {
  padding: 10px;
  .coach_course {
    padding-top: 8px;
    color: #999999;
    overflow: hidden;
    border-radius: 8px;
    margin-bottom: 8px;
    background-color: #fff;
    box-shadow: 3px 3px 3px #cccccc;
    /deep/ .van-cell__title {
      font-size: 12px;
      color: #666666;
    }
    /deep/ .van-cell {
      padding: 0 8px;
    }
    /deep/ .van-collapse-item__content {
      padding: 0;
    }
    /deep/ .van-cell::after, /deep/ .van-collapse-item, /deep/ .van-hairline--top-bottom::after {
      border: none;
    }
    .top_info {
      display: flex;
      padding: 0 8px;
      align-items: center;
      padding-bottom: 8px;
      justify-content: space-between;
      border-bottom: 1px solid #ececec;
      .evrey_info {
        width: 33%;
        .label {
          margin-bottom: 5px;
          .coach_name {
            font-size: 14px;
          }
        }
        .pass_btn, .reject_btn, .has_check, .sign_person {
          padding: 5px;
          color: #fff;
          font-size: 13px;
          border-radius: 8px;
          text-align: center;
          background-color: #5487e6;
        }
        .reject_btn {
          margin-top: 5px;
          color: #6b6b6b;
          background-color: #f1f366;
        }
        .has_check {
          background-color: #b6b6b6;
        }
        .sign_person {
          margin-top: 5px;
          background-color: #ee91ca;
        }
      }
    }
    .no_flod {
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .content {
        color: #666666;
      }
      .no_upload {
        font-size: 11px;
        color: #999999;
      }
      .notice {
        color: #fff;
        padding: 0 15px;
        line-height: 18px;
        background-color: #f32b11;
      }
    }
    .every_corse {
      font-size: 12px;
      color: #666666;
      line-height: 16px;
      position: relative;
      word-break: break-all;
      padding: 20px 8px 8px 8px;
      background-color: #f3f3f3;
      .download_link {
        text-decoration: underline;
      }
      .sort {
        top: 0;
        right: 0;
        width: 66px;
        color: #000;
        line-height: 20px;
        text-align: center;
        position: absolute;
        text-align: center;
        border-radius: 0 0 0 8px;
        background-color: #fdc2b0;
      }
    }
  }
}
</style>