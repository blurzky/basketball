<template>
  <div>
    <div class="page">
      <div v-show="list.length" class="box" v-for="({ date, start_time, end_time, dis_grade, studys_grade, week, addr, comment, coach_name, medias, uname}, index) in list" :key="index">
        <div class="wrapper">
          <div class="label">上课时间:</div>
          <span>{{new Date(date).toLocaleDateString().split('/').join('-')}} {{start_time}}-{{end_time}} {{week}}</span>
        </div>
        <div class="wrapper">
          <div class="label">上课教练:</div>
          <span>{{coach_name}}</span>
        </div>
        <div class="wrapper">
          <div class="label">上课地点:</div>
          <div class="addr">{{addr}}</div>
        </div>
        <div class="devision"></div>
        <div class="wrapper">
          <div class="label">学员姓名:</div>
          <span>{{uname}}</span>
        </div>
        <div class="wrapper">
          <div class="label">纪律得分:</div>
          <div class="addr">{{dis_grade}}分</div>
          <div class="right_label">上课得分:</div>
          <div class="addr">{{studys_grade}}分</div>
        </div>
        <div class="wrapper">
          <div class="label">上课评价:</div>
          <div class="addr">{{comment}}</div>
        </div>
        <div class="btns">
          <div class="pass" @click="pass(index)">通过</div>
          <div class="refuse" @click="dialogShow = true;listIndex = index">驳回</div>
        </div>
        <div class="pic_video_wrapper">
          <div v-for="({media_url, type}, index) in JSON.parse(medias)" :key="index" class="wrapper_box" @click="openPic(type, media_url)">
            <img v-if="type === 1" class="pic" :src="media_url" />
            <video v-else class="video" :src="media_url" />
          </div>
        </div>
      </div>
    </div>
    <van-popup v-model="picShow" closeable @close="closePic">
      <div class="pic_wrapper">
        <img v-if="picType === 1" :src="openPicUrl">
        <video v-else ref="video" controls :src="openPicUrl" />
      </div>
    </van-popup>
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
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Button, Field, Icon, Popup, Dialog } from 'vant'
  @Component({
    components: {
      [Button.name]: Button,
      [Field.name]: Field,
      [Icon.name]: Icon,
      [Popup.name]: Popup,
      [Dialog.Component.name]: Dialog.Component,
    }
  })
  export default class CoachCheck extends Vue {
    private dialogShow: boolean = false;
    private picShow: boolean = false;
    private picType: number = null;
    private list: any[] = [];
    private openPicUrl: string = null;
    private mark: string = null;
    private listIndex: number = null;
    protected created(): void {
      this.getList();
    }
    private openPic(type: number, Picurl: string): void {
      this.picType = type;
      this.openPicUrl = Picurl;
      this.picShow = true;
    }
    private closePic(): void {
      if (this.$refs.video) {
        (this.$refs.video as any).pause();
      }
    }
    private async getList(): Promise<any> {
      if (!this.$store.state.loadingStatus) {
        this.$toast.loading();
      }
      try {
        const obj = await this.$api({
          url: '/coachComment/findDaiAuditList',
          data: {
            rectorId: this.$route.query.rectorId,
          },
        });
        this.list = obj;
        this.$store.commit('setLoadingStatus', false);
        this.$toast.clear();
      } catch (error) {
        this.$toast.fail(error);
      }
    }
    
    private pass(index: number): void {
      const {course_id, coach_id, id, userid} = this.list[index];
      Dialog.confirm({
        title: '通过',
        message: '是否确认通过',
      }).then( async() => {
        this.$toast.loading();
        try {
          await this.$api({
            url: '/coachComment/auditCoachComment',
            data: {
              userid,
              coachId: coach_id,
              courseId: course_id,
              state: 2,
              mark: '',
              id,
            },
          });
          this.list.splice(index, 1);
          this.$toast('通过成功');
        } catch(error) {
          this.$toast.fail(error);
        }
      })
      .catch(() => {
      });
    }
    private async reject(): Promise<any> {
      if (this.mark) {
        const {course_id, coach_id, id, userid} = this.list[this.listIndex];
        this.$toast.loading();
        try {
          await this.$api({
            url: '/coachComment/auditCoachComment',
            data: {
              userid,
              coachId: coach_id,
              courseId: course_id,
              state: 3,
              mark: this.mark,
              id,
            }
          });
          this.list.splice(this.listIndex, 1);
          this.$toast('驳回成功');
        } catch(error) {
          this.$toast.fail(error);
        }
      } else {
        this.$toast('请填写驳回信息');
      }
      
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    padding: 10px 12px;
    .box {
      padding: 12px;
      font-size: vw(13);
      position: relative;
      border-radius: 10px;
      margin-bottom: 20px;
      background-color: #fff;
      box-shadow: 3px 3px 3px #adadad;
      .wrapper {
        display: flex;
        line-height: 24px;
        align-items: center;
        justify-content: flex-start;
        .label {
          width: vw(70);
          align-self: flex-start;
        }
        .right_label {
          width: vw(70);
          margin-left: vw(20);
        }
        .addr {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .devision {
        height: 1px;
        margin: 8px 0;
        border-top: 1px dashed #666666;
      }
      .pic_video_wrapper {
        display: flex;
        padding: 5px 0;
        overflow-x: scroll;
        align-items: center;
        justify-content: flex-start;
        .wrapper_box {
          margin-right: vw(10);
          .pic, .video {
            width: vw(70);
            height: vw(70);
            object-fit: cover;
            border-radius: 12px;
          }
        }
      }
      .btns {
        top: 35px;
        right: 10px;
        line-height: 20px;
        position: absolute;
        .pass {
          color: #fff;
          padding: 0 10px;
          background-color: #618bff;
        }
        .refuse {
          color: #999;
          padding: 0 10px;
          margin-top: 5px;
          background-color: #edf668;
        }
      }
    }
    .pic_wrapper {
      background-color: #000;
      &>img {
        width: 100vw;
        height: 60vh;
        object-fit: cover;
      }
      &>video {
        width: 100vw;
        height: 60vh;
      }
    }
  }
</style>
