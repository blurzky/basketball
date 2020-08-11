<template>
  <div>
    <div class="page">
      <div class="box" v-for="({ id, coachCommentId, addr, coachComment, coachDisGrade, coachStudyGrade, coach_name, time, etime, medias, userStudyGrade, userDisGrade, userCourseGrade, week}, index) in list" :key="index">
        <div class="wrapper">
          <div class="label">上课时间:</div>
          <span>{{time}}-{{etime.substr(11, 5)}}</span>
          <span class="week">{{week}}</span>
          <div class="devision"></div>
          <div class="give_point" @click="givePoint(id, coachCommentId)">打分</div>
        </div>
        <div class="wrapper">
          <div class="label">上课教练:</div>
          <span>{{coach_name}}</span>
          <div class="right_label">上课地点:</div>
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
            <img class="pic" :src="media_url" />
          </div>
        </div>
        <div class="devision"></div>
        <div class="wrapper">
          <div class="label">家长评语:</div>
          <div class="addr">孩子上课表现得很好xxxxxxxxxxxxxxxxxxxxxxxxxx</div>
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
          <div class="addr">孩子上课表现得很好xxxxxxxxxxxxxxxxxxxxxxxxxx</div>
        </div>
      </div>
      <van-popup v-model="picShow" closeable>
        <div class="pic_wrapper">
          <img v-if="picType === 1" :src="openPicUrl">
          <video v-else controls src="https://oss.tanjie.shop/2020-08-11/202008111016424912.mp4" />
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
  import { Component, Vue } from 'vue-property-decorator'
  import { Button, Popup, Rate, Field } from 'vant'
  @Component({
    components: {
      [Button.name]: Button,
      [Popup.name]: Popup,
      [Rate.name]: Rate,
      [Field.name]: Field,
    }
  })
  export default class Comment extends Vue {
    private role: any = this.$route.query.role;
    private courseId: number = null;
    private coachId: number = null;
    private isShow: boolean = false;
    private picShow: boolean = false;
    private starShow: boolean = false;
    private picType: number = null;
    private list: any[] = [];
    private page: number = 0;
    private openPicUrl: string = null;
    private coachDisStar: number = null;
    private coachStudyStar: number = null;
    private comment: string = null;
    protected created(): void {
      this.getList();
    }
    private givePoint(id: number, coachCommentId: number): void {
      this.courseId = id;
      this.coachId = coachCommentId;
      this.starShow = true;
    }
    private openPic(type: number, Picurl: string): void {
      this.picType = type;
      this.openPicUrl = Picurl;
      this.picShow = true;
    }
    private async getList(): Promise<any> {
      try {
        const obj = await this.$api({
          url: this.role === '1' ? '/course/findCoachCommentList' : '/course/findUserEvalumentList',
          data: {
            userid: this.$store.state.userid || 63,
            page: this.page
          }
        });
        this.$store.commit('setLoadingStatus', false);
        this.list = obj;
      } catch (error) {
        this.$toast.fail(`${error}`);
      }
    }
    private async submit(): Promise<any> {
      const { comment, courseId, coachId, coachDisStar, coachStudyStar } = this;
      if (comment && coachDisStar && coachStudyStar) {
        try {
          this.$toast.loading();
          await this.$api({
            url: 'coachComment/updateCoachComment',
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
          this.$toast.clear();
          this.starShow = false;
          this.list = [];
          this.getList();
        } catch (error) {
          this.$toast.fail(`${error}`);
        }
      } else {
        this.$toast('请完善内容');
      }
    }
    private closeStar(): void {
      this.coachDisStar = null;
      this.coachStudyStar = null;
      this.comment = null;
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    padding: 20px 12px;
    .box {
      padding: 12px;
      font-size: 13px;
      border-radius: 10px;
      margin-bottom: 30px;
      background-color: #fff;
      box-shadow: 3px 3px 3px #adadad;
      .wrapper {
        display: flex;
        line-height: 24px;
        align-items: center;
        justify-content: flex-start;
        .week {
          margin-left: 5px;
        }
        .label {
          width: 70px;
        }
        .small_label {
          width: 40px;
        }
        .right_label {
          width: 70px;
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
          padding: 0 8px;
          font-size: 12px;
          margin-left: 20px;
          border-radius: 6px;
          text-align: center;
          background-color: #73a2f8;
        }
      }
      .devision {
        height: 15px;
      }
      .pic_video_wrapper {
        display: flex;
        padding: 10px 0;
        align-items: center;
        justify-content: flex-start;
        .wrapper_box {
          margin-right: 15px;
          .pic {
            width: 70px;
            height: 70px;
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
      padding: 40px 20px;
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
