<template>
  <div>
    <div class="page">
      <van-tabs v-model="tab" sticky color="#73a2f8" line-width="20" @change="changeTab">
        <van-tab v-for="(item, index) in tabs" :key="index" :title="item" :style="{padding: `.1px 12px 20px 12px`}">
          <div  v-show="list.length" class="box" v-for="({ remark, coach_id, id, coachCommentId, addr, coachComment, coachDisGrade, coachStudyGrade, coach_name, time, etime, medias, userStudyGrade, userDisGrade, userCourseGrade, week}, index) in list" :key="index">
            <div class="wrapper">
              <div class="label">上课时间:</div>
              <span>{{time}}-{{etime.substr(11, 5)}}</span>
              <span class="week">{{week}}</span>
              <div class="devision"></div>
              <div v-if="tab === 0" class="give_point" @click="givePoint(id, coachCommentId, coach_id)">打分</div>
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
              <div @click="savePic(id, index)">
                <van-uploader v-if="role === 2 && JSON.parse(medias).length <= 4" class="upload" accept="image/*, video/*" preview-size="70px" :after-read="upLoadImg" />
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
        </van-tab>
      </van-tabs>
      <van-popup v-model="picShow" closeable @close="closePic">
        <div class="pic_wrapper">
          <img v-if="picType === 1" :src="openPicUrl">
          <video v-else ref="video" controls :src="openPicUrl" />
        </div>
      </van-popup>
      <van-popup v-model="starShow" position="bottom" :style="{ height: '55%' }" @closed="closeStar">
        <div class="star_box">
          <div v-if="role === 1" class="star_line">
            <span class="label">课程评分</span>
            <van-rate v-model="gradeStar" :size="25" color="#ffd21e" void-icon="star" void-color="#eee" />
          </div>
          <div class="star_line">
            <span class="label">{{role === 1 ? '学习内容评分' : '教学内容评分'}}</span>
            <van-rate v-model="coachDisStar" :size="25" color="#ffd21e" void-icon="star" void-color="#eee" />
          </div>
          <div class="star_line">
            <span class="label">{{role === 1 ? '上课纪律评分' : '纪律评分'}}</span>
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
  import { Button, Popup, Rate, Field, Tab, Tabs, Uploader, Icon } from 'vant'
  @Component({
    components: {
      [Button.name]: Button,
      [Popup.name]: Popup,
      [Rate.name]: Rate,
      [Field.name]: Field,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [Uploader.name]: Uploader,
      [Icon.name]: Icon,
    }
  })
  export default class Comment extends Vue {
    private role: any = Number(this.$route.query.role);
    private courseId: number = null;
    private coachId: number = null;
    private coachid: number = null;
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
    private tab: number = 0;
    private tabs: string[] = ['未打分', '已打分'];
    private size: number = 0;
    private more: boolean = true;
    protected created(): void {
      this.getList();
    }
    private beforeDestroy(): void {
      window.removeEventListener('scroll', this.scroll);
    }
    private changeTab(e: number): void {
      this.tab = e;
      this.list = [];
      this.getList();
    }
    private givePoint(id: number, coachCommentId: number, coach_id: number): void {
      this.courseId = id;
      this.coachId = coachCommentId;
      this.coachid = coach_id;
      this.starShow = true;
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
          url: this.role === 1 ? '/course/findUserEvalumentList' : '/course/findCoachCommentList',
          data: {
            userid: this.$store.state.userid,
            page: this.page,
            type: this.tab + 1
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
      const { role, comment, courseId, coachId, coachid, coachDisStar, coachStudyStar, gradeStar } = this;
      if (comment && coachDisStar && coachStudyStar) {
        try {
          this.$toast.loading();
          if (role === 1) {
            if (gradeStar) {
              await this.$api({
                url: '/evaluate/addEvaluate',
                data: {
                  remark: comment,
                  courseId,
                  disGrade: coachDisStar,
                  studyGrade: coachStudyStar,
                  courseGrade: gradeStar,
                  userid: this.$store.state.userid,
                  coachId: coachid
                },
                form: false,
                headers: 'json'
              });
            } else {
              this.$toast('请完善内容');
            }
          } else {
            await this.$api({
              url: '/coachComment/updateCoachComment',
              data: {
                comment,
                courseId,
                disGrade: coachDisStar,
                id: coachId,
                studysGrade: coachStudyStar,
                userid: this.$store.state.userid,
              },
              form: false,
              headers: 'json'
            });
          }
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
    private savePic(courseId: number, index: number): void {
      this.courseId = courseId;
      this.listIndex = index;
    }
    private  upLoadImg(e: any) {
      const { file } = e;
      if (file.size > 104857600) {
        this.$toast('文件过大，上传失败');
      } else {
        this.$toast.loading();
        const form = new FormData();
        form.append('name', file.name);
        form.append('file', file);
        axios.post('/api/oss/AliyunOssUpload', form).then( async (res: any) => {
          const { type, url } = res.data;
          await this.$api({
            url: '/courseMedia/addCourseMedia',
            data: {
              type,
              mediaUrl: url,
              courseId: this.courseId,
              sort: JSON.parse(this.list[this.listIndex].medias).length + 1
            },
            headers: 'json',
            form: false,
          })
          this.$toast('上传成功');
        }).catch((error) => this.$toast(error));
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    .box {
      padding: 12px;
      font-size: vw(13);
      border-radius: 10px;
      margin-top: 20px;
      background-color: #fff;
      box-shadow: 3px 3px 3px #adadad;
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
        .give_point {
          color: #fff;
          padding: 0 vw(8);
          font-size: vw(12);
          border-radius: 6px;
          text-align: center;
          margin-left: vw(20);
          background-color: #73a2f8;
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
        object-fit: cover;
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
