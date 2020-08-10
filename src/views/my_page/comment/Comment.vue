<template>
  <div>
    <div class="page">
      <div class="box">
        <div class="wrapper">
          <div class="label">上课时间:</div>
          <span>2020.8.1 18:00-19:00 星期六</span>
          <div class="devision"></div>
          <div class="give_point">打分</div>
        </div>
        <div class="wrapper">
          <div class="label">上课教练:</div>
          <span>万教练</span>
          <div class="right_label">上课地点:</div>
          <div class="addr">西源大道1号1234564</div>
        </div>
        <div class="devision"></div>
        <div class="wrapper">
          <div class="label">纪律得分:</div>
          <div class="addr">5分</div>
          <div class="right_label">上课得分:</div>
          <div class="addr">5分</div>
        </div>
        <div class="wrapper">
          <div class="label">上课评价:</div>
          <div class="addr">孩子上课表现得很好xxxxxxxxxxxxxxxxxxxxxxxxxx</div>
        </div>
        <div class="pic_video_wrapper">
          <img v-for="(item, index) in 4" :key="index" class="pic" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596966043470&di=c8fdcc0ae6dcbf9b6e73a0db82700223&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fw%3D580%2Fsign%3Da9714efaaf86c91708035231f93c70c6%2Fddd3ab59d109b3dea0394e6ac4bf6c81810a4c48.jpg">
        </div>
        <div class="devision"></div>
        <div class="wrapper">
          <div class="label">家长评语:</div>
          <div class="addr">孩子上课表现得很好xxxxxxxxxxxxxxxxxxxxxxxxxx</div>
        </div>
        <div class="wrapper">
          <div class="small_label">纪律:</div>
          <div>5分</div>
          <div class="right_label">教学内容:</div>
          <div>5分</div>
          <div class="right_label">教练执教:</div>
          <div>5分</div>
        </div>
        <div class="wrapper">
          <div class="label">详细评价:</div>
          <div class="addr">孩子上课表现得很好xxxxxxxxxxxxxxxxxxxxxxxxxx</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Button } from 'vant'
  @Component({
    components: {
      [Button.name]: Button,
    }
  })
  export default class Comment extends Vue {
    private isShow: boolean = false;
    protected created(): void {
      this.$store.commit('setLoadingStatus', false);
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    padding: 10px;
    .box {
      padding: 12px;
      font-size: 13px;
      border-radius: 10px;
      background-color: #fff;
      box-shadow: 5px 5px 3px #adadad;
      .wrapper {
        display: flex;
        line-height: 24px;
        align-items: center;
        justify-content: flex-start;
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
          width: 30px;
          color: #fff;
          padding: 0 5px;
          font-size: 12px;
          margin-left: 20px;
          border-radius: 6px;
          text-align: center;
          background-color: #7c9df8;
        }
      }
      .devision {
        height: 15px;
      }
      .pic_video_wrapper {
        display: flex;
        padding: 10px 0;
        align-items: center;
        justify-content: space-between;
        .pic {
          width: 70px;
          height: 70px;
          object-fit: cover;
          border-radius: 12px;
        }
      }
    }
  }
</style>
