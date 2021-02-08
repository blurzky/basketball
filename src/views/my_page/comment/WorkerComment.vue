<template>
  <div>
    <div class="page">
      <van-calendar v-model="calendarShow" type="range" @confirm="chooseDate" color="#73a2f8" :min-date="minDate" :max-date="maxDate" />
      <div class="top_date" @click="calendarShow = true">{{stime}} 至 {{etime}}</div>
      <div v-show="list.length" class="box" v-for="({ state, remark, addr, coachComment, coachDisGrade, coachStudyGrade, coach_name, time, etime, medias, userStudyGrade, userDisGrade, userCourseGrade, week, uname, group_name}, index) in list" :key="index">
        <div v-if="state === 0 || 3" :style="state === 3 ? 'background-color:#e23030' : ''" class="give_point" @click="listIndex = index;starShow = true">
          <span v-if="state === 0">打分</span>
          <span v-if="state === 3">修改</span>
        </div>
        <div class="state_box" :class="`state${state}`">{{state | setState}}</div>
        <div class="wrapper">
          <div class="label">上课时间:</div>
          <span>{{time}}-{{etime.substr(11, 5)}}</span>
          <span class="week">{{week}}</span>
          <div class="devision"></div>
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
        <div class="devision"></div>
        <div class="wrapper">
          <div class="label">学员姓名:</div>
          <span>{{uname}}</span>
          <div class="right_label">组别:</div>
          <div class="addr">{{group_name}}</div>
        </div>
        <div class="wrapper">
          <div class="label">纪律得分:</div>
          <div v-if="coachDisGrade !== null" class="addr">{{coachDisGrade}}分</div>
          <div class="right_label">上课得分:</div>
          <div v-if="coachStudyGrade !== null" class="addr">{{coachStudyGrade}}分</div>
        </div>
        <div class="wrapper">
          <div class="label">上课评价:</div>
          <div class="addr">{{coachComment}}</div>
        </div>
        <div class="pic_video_wrapper">
          <div v-for="({media_url, type}, index) in JSON.parse(medias)" :key="index" class="wrapper_box" @click="openPic(type, media_url)">
            <img v-if="type === 1" class="pic" :src="media_url" />
            <video v-else class="video" :src="media_url" />
          </div>
          <div @click="listIndex = index">
            <van-uploader v-if="JSON.parse(medias).length <= 4" class="upload" accept="image/*, video/*" preview-size="70px" :after-read="upLoadImg" />
          </div>
        </div>
        <div class="devision"></div>
        <div :style="{border: `1px dashed #eeeeee`, borderRadius: `14px`, padding: `8px`}">
          <div class="wrapper">
            <div class="label">家长评语:</div>
            <div class="addr">{{remark}}</div>
          </div>
          <div class="wrapper">
            <div class="small_label">纪律:</div>
            <span v-if="userDisGrade !== null">{{userDisGrade}}分</span>
            <div class="right_label">教学内容:</div>
            <span v-if="userStudyGrade !== null">{{userStudyGrade}}分</span>
            <div class="right_label">教练执教:</div>
            <span v-if="userCourseGrade !== null">{{userCourseGrade}}分</span>
          </div>
          <div class="wrapper">
            <div class="label">详细评价:</div>
            <div class="comment_all">{{remark}}</div>
          </div>
        </div>
      </div>
      <van-popup v-model="picShow" closeable @close="closePic">
        <div class="pic_wrapper">
          <img v-if="picType === 1" :src="openPicUrl">
          <video v-else ref="video" controls :src="openPicUrl" />
        </div>
      </van-popup>
      <van-popup v-model="starShow" position="bottom" :style="{ height: '55%' }" @closed="closeStar">
        <div class="star_box">
          <div class="star_line">
            <span class="label">教学内容评分</span>
            <van-rate v-model="coachDisStar" :size="25" color="#ffd21e" void-icon="star" void-color="#eee" />
          </div>
          <div class="star_line">
            <span class="label">纪律评分</span>
            <van-rate v-model="coachStudyStar" :size="25" color="#ffd21e" void-icon="star" void-color="#eee" />
          </div>
          <div class="star_line">
            <span class="label_comment">评语</span>
            <van-field v-model="comment" rows="3" autosize type="textarea" maxlength="100" placeholder="请输入评语" show-word-limit />
          </div>
          <div class="submit">
            <van-button type="info" round block @click="submit">提交</van-button>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script lang="ts">
  import axios from 'axios'
  import { Component, Vue } from 'vue-property-decorator'
  import { Button, Popup, Rate, Field, Uploader, Icon, Calendar } from 'vant'
  @Component({
    components: {
      [Button.name]: Button,
      [Popup.name]: Popup,
      [Rate.name]: Rate,
      [Field.name]: Field,
      [Uploader.name]: Uploader,
      [Icon.name]: Icon,
      [Calendar.name]: Calendar,
    },
    filters: {
      setState(res: number) {
        if (res === 0) {
          return '未打分'
        } else if (res === 1) {
          return '待审核'
        } else if (res === 2) {
          return '审核通过'
        } else if (res === 3) {
          return '被驳回'
        }
      }
    }
  })
  export default class Comment extends Vue {
    private isShow: boolean = false;
    private picShow: boolean = false;
    private starShow: boolean = false;
    private picType: number = null;
    private listIndex: number = null;
    private list: any[] = [];
    private page: number = 0;
    private openPicUrl: string = null;
    private gradeStar: number = null;
    private coachDisStar: number = null;
    private coachStudyStar: number = null;
    private comment: string = null;
    private size: number = 0;
    private more: boolean = true;
    private calendarShow: boolean = false;
    private stime: string = '';
    private etime: string = '';
    private maxDate: any = new Date();
    private minDate: any = new Date(2000, 0, 1);
    protected created(): void {
      this.stime = this.formDate(new Date().getTime() - 60*24*3600*1000);
      this.etime = this.formDate(new Date());
      this.getList();
    }
    private beforeDestroy(): void {
      window.removeEventListener('scroll', this.scroll);
    }
    private chooseDate(date: any): void {
      this.stime = this.formDate(new Date(date[0]));
      this.etime = this.formDate(new Date(date[1]));
      this.calendarShow = false;
      this.page = 0;
      this.list = [];
      this.getList();
    }
    private formDate(date: any): string {
      const timeList = new Date(date).toLocaleDateString().split('/');
      let time = `${timeList[0]}-${Number(timeList[1]) < 10 ? '0' : ''}${timeList[1]}-${Number(timeList[2]) < 10 ? '0' : ''}${timeList[2]}`
      return time
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
          url: '/course/findCoachCommentList',
          data: {
            userid: this.$store.state.userid,
            page: this.page,
            stime: `${this.stime} 00:00:00`,
            etime: `${this.etime} 23:59:59`,
          }
        });
        this.list.push(...obj);
        this.$nextTick(() => {
          window.addEventListener('scroll', this.scroll);
        });
        this.$store.commit('setLoadingStatus', false);
        this.$toast.clear();
      } catch (error) {
        this.$toast.fail(error);
      }
    }
    private scroll(e: any): void {
      const height = document.body.scrollHeight;
      const scrollTop = Math.ceil(document.documentElement.scrollTop + document.documentElement.clientHeight);
      if (scrollTop >= height && this.list.length && this.list.length % 20 === 0 && this.more) {
        this.size += 1;
        this.getList();
      }
    }
    private async submit(): Promise<any> {
      const { comment, coachDisStar, coachStudyStar, gradeStar } = this;
      if (comment && coachDisStar && coachStudyStar) {
        try {
          this.$toast.loading();
          await this.$api({
            url: '/coachComment/updateCoachComment',
            data: {
              comment,
              courseId: this.list[this.listIndex].id,
              disGrade: coachDisStar,
              id: this.list[this.listIndex].coachCommentId || '',
              studysGrade: coachStudyStar,
              userid: this.list[this.listIndex].userid,
              uname: this.list[this.listIndex].uname,
              useridId: this.$store.state.userid
            },
            form: false,
          });
          this.$toast.clear();
          this.starShow = false;
          this.list = [];
          this.getList();
        } catch (error) {
          this.$toast.fail(error);
        }
      } else {
        this.$toast('请完善内容');
      }
    }
    private closeStar(): void {
      this.coachDisStar = null;
      this.coachStudyStar = null;
      this.comment = null;
      this.gradeStar = null;
    }
    private  upLoadImg(e: any) {
      const { file } = e;
      if (file.size > 104857600) {
        this.$toast('文件过大，上传失败');
      } else {
        this.$toast.loading();
        const data: any = new FormData();
        data.append('name', file.name);
        data.append('file', file);
        axios({
          method: 'post',
          url: '/api/localStorage/uploadImgOrVideo',
          data,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }).then( async (res: any) => {
          await this.$api({
            url: '/courseMedia/addCourseMedia',
            data: {
              type: file.type.includes('image') ? 1 : 2,
              mediaUrl: res.data,
              courseId: this.list[this.listIndex].id,
              sort: JSON.parse(this.list[this.listIndex].medias).length + 1
            },
            form: false,
          })
          const list = JSON.parse(this.list[this.listIndex].medias);
          list.push({
            media_url: res.data,
            type: file.type.includes('image') ? 1 : 2,
          })
          this.list[this.listIndex].medias = JSON.stringify(list);
          this.$toast('上传成功');
        }).catch((error) => this.$toast(error));
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    padding: 50px 12px 0 12px;
    .top_date {
      top: 0;
      left: 0;
      z-index: 99;
      width: 100%;
      height: 30px;
      font-size: 15px;
      position: fixed;
      line-height: 30px;
      text-align: center;
      background-color: #fff;
    }
    .box {
      font-size: vw(13);
      position: relative;
      border-radius: 10px;
      margin-bottom: 20px;
      background-color: #fff;
      padding: 28px 12px 12px 12px;
      .give_point {
        top: 2px;
        left: 12px;
        width: 44px;
        color: #fff;
        font-size: 12px;
        line-height: 22px;
        position: absolute;
        text-align: center;
        border-radius: 3px;
        background-color: #73a2f8;
      }
      .state_box {
        top: 0;
        right: 0;
        width: 70px;
        color: #fff;
        font-size: 12px;
        line-height: 24px;
        position: absolute;
        text-align: center;
        border-radius: 0 9px 0 9px;
      }
      .state0 {
        background-color: #73a2f8;
      }
      .state1 {
        background-color: #b5beb6;
      }
      .state2 {
        background-color: #57eb6a;
      }
      .state3 {
        background-color: #e23030;
      }
      .wrapper {
        display: flex;
        line-height: 24px;
        align-items: center;
        justify-content: flex-start;
        .week {
          margin-left: vw(5);
        }
        .label {
          width: vw(70);
          align-self: flex-start;
        }
        .small_label {
          width: vw(40);
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
        .devision {
          flex: 1;
        }
        .comment_all {
          flex: 1;
          word-break: break-all;
        }
      }
      .devision {
        height: 1px;
        margin: 8px 0;
        border-top: 1px solid #eeeeee;
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
    }
    .pic_wrapper {
      background-color: #000;
      &>img {
        width: 100vw;
        height: 60vh;
        object-fit: contain;
      }
      &>video {
        width: 100vw;
        height: 60vh;
      }
    }
    .star_box {
      height: 100%;
      display: flex;
      padding: 20px;
      flex-direction: column;
      box-sizing: border-box;
      align-items: flex-start;
      justify-content: flex-start;
      .star_line {
        display: flex;
        align-items: center;
        margin-bottom: 30px;
        justify-content: flex-start;
        .label, .label_comment {
          font-size: 15px;
          font-weight: 600;
          min-width: 100px;
          margin-right: 20px;
        }
        /deep/ .van-cell {
          padding: 5px;
          width: vw(200);
          border-radius: 8px;
          background-color: #f3f3f3;
        }
        .label_comment {
          align-self: flex-start;
        }
      }
      .submit {
        width: 200px;
        margin: 0 auto;
      }
    }
  }
</style>
