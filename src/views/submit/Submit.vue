<template>
  <div>
    <div class="page">
      <div class="box" v-if="info">
        <van-cell title="上课时间：" :value="`${info.week} ${info.start_time} - ${info.end_time}`" size="large" title-class="title_class" value-class="value_class" />
        <van-cell title="上课地点：" :value="info.addr"  size="large" title-class="title_class" value-class="value_class" />
        <van-cell title="上课教练：" :value="info.coach_name"  size="large" title-class="title_class" value-class="value_class" />
        <van-cell title="联系电话：" :value="info.phone"  size="large" title-class="title_class" value-class="value_class" />
        <van-field
          v-model="message"
          rows="5"
          autosize
          label=""
          type="textarea"
          maxlength="200"
          show-word-limit
          placeholder="请填写不能上课的原因"
        />
        <div class="btns">
          <van-button round type="primary" class="btn" @click="submit(4)">能上课</van-button>
          <van-button round type="info" class="btn" @click="submit(3)">不能上课</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Button, Cell, Field } from 'vant'
  @Component({
    components: {
      [Button.name]: Button,
      [Cell.name]: Cell,
      [Field.name]: Field,
    }
  })
  export default class Submit extends Vue {
    private message: string = '';
    private info: any = null;
    protected created(): void {
      if (this.$store.state.userid) {
        const url = encodeURIComponent(location.href);
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0e734c0a8f759921&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo#wechat_redirect`;
      } else {
        this.getInfo();
      }
    }
    private async getInfo(): Promise<any> {
      try {
        const obj = await this.$api({
          url: '/course/findCourseInfoById',
          data: {
            courseId: this.$route.query.courseId,
            userid: this.$store.state.userid
          }
        });
        this.info = obj;
        this.$store.commit('setLoadingStatus', false);
      } catch (error) {
        this.$toast(error);
      }
    }
    private async submit(type: number): Promise<any> {
      if (type === 3 && !this.message.length) {
        this.$toast('请填写原因')
      } else {
        try {
          await this.$api({
            url: '/courseStudent/updateCourseStudent',
            data: {
              courseId: this.$route.query.courseId,
              userid: this.$store.state.userid,
              state: type,
              remark: this.message
            }
          });
          this.$toast('提交成功');
        } catch (error) {
          this.$toast(error);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    background-color: #ececec;
    /deep/ .van-field__control {
      padding: 5px 10px;
      border-radius: 12px;
      background-color: #f3f3f3;
    }
    /deep/ .van-cell::after {
      border: none;
    }
    .box {
      padding: 20px 10px;
      background-color: #fff;
      .title_class {
        font-size: 14px;
        max-width: 100px;
        font-weight: bold;
      }
      .value_class {
        color: #000;
        text-align: start;
      }
      .btns {
        display: flex;
        padding: 0 20px;
        align-items: center;
        justify-content: space-around;
        .btn {
          width: 120px;
        }
      }
    }
  }
</style>
