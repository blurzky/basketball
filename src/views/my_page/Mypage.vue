<template>
  <div>
    <div v-if="userinfo" class="page">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(image, index) in images" :key="index">
          <img class="swipe_img" v-lazy="image" />
        </van-swipe-item>
      </van-swipe>
      <div class="top">
        <div class="info">
          <img :src="userinfo.head">
          <div class="name">
            <div class="label">{{userinfo.uname}}</div>
            <div v-if="addrGroup.addr" class="label">校区:{{addrGroup.addr}}</div>
            <div v-if="addrGroup.groupName" class="label">组别:{{addrGroup.groupName}}</div>
          </div>
          <img class="set_img" src="./icon/椭圆 1 拷贝@2x.png">
        </div>
        <div class="vip">
          <div class="vip_icon">V</div>
          <span class="time">有效期至 {{overTime}}</span>
          <span class="name">比高会员</span>
        </div>
      </div>
      <div class="my_class">
        <div class="wrapper">
          <div v-for="(item, index) in className" :key="index" class="class_type">
            <div class="num">{{classList[index]}}</div>
            <div class="name">{{item}}</div>
          </div>
        </div>
      </div>
      <div class="cell_box">
        <div v-for="({img, name}, index) in cells" :key="index" class="cell" @click="chooseCell(index)">
          <img :src="img" />
          <span>{{name}}</span>
        </div>
      </div>
      <div class="end_title">
        <a href="">
          <span style="margin-right: 30px" @click="$toast('功能开发中')">客户须知</span>
        </a>
         <a href="tel: 13540497299">
           <span>联系客服</span>
         </a>
      </div>
    </div>
    <share-popup v-if="isShow" :isShow.sync="isShow" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Button, Icon, Cell, Swipe, SwipeItem } from 'vant'
  @Component({
    components: {
      [Button.name]: Button,
      [Icon.name]: Icon,
      [Cell.name]: Cell,
      [Swipe.name]: Swipe,
      [SwipeItem.name]: SwipeItem,
      SharePopup: () => import('./share_popup/SharePopup.vue')
    }
  })
  export default class MyPage extends Vue {
    private className: string[] = ['剩余课程', '已上课程'];
    private classList: number[] = [];
    private isShow: boolean = false;
    private overTime: string = null;
    private userinfo: any = null;
    private addrGroup: any = null;
    private images: any[] = [
      'https://img.yzcdn.cn/vant/apple-1.jpg',
      'https://img.yzcdn.cn/vant/apple-2.jpg',
    ];
    private cells: any[] = [{
      img: require('./icon/组 6@2x.png'),
      name: '自主选课'
    }, {
      img: require('./icon/组 5@2x.png'),
      name: '课程表'
    }, {
      img: require('./icon/组 4@2x.png'),
      name: '课程打分'
    }, {
      img: require('./icon/组 7@2x.png'),
      name: '关于我们'
    }, {
      img: require('./icon/组 8@2x.png'),
      name: '分享训练营'
    }, {
      img: require('./icon/组 9@2x.png'),
      name: '留言板'
    }, {
      img: require('./icon/set.png'),
      name: '个人设置'
    }];
    protected created(): void {
      if (!this.$store.state.userid) {
        const url = encodeURIComponent(`${location.origin + location.pathname}`);
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0e734c0a8f759921&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo#wechat_redirect`;
      } else {
        this.getInfo();
      }
    }
    private async getInfo(): Promise<any> {
      try {
        const { beeagleUsers, buySum, remaSum, vipOutTime, addr, groupName } = await this.$api({
          url: `/courseRema/findById?userid=${this.$store.state.userid}`,
          method: 'get',
        })
        if (beeagleUsers.role > 1) {
          this.$router.replace('/worker_page');
        }
        this.formatOverTime(vipOutTime);
        this.classList.push(remaSum, buySum - remaSum);
        this.userinfo = beeagleUsers;
        this.addrGroup = {
          addr: addr,
          groupName: groupName
        };
        if ((this.userinfo as any).birthday) {
          const e: any = new Date((this.userinfo as any).birthday);
          (this.userinfo as any).birthday = `${e.getFullYear()}-${e.getMonth() < 9 ? `0` : ``}${e.getMonth() + 1}-${e.getDate() < 10 ? `0` : ``}${e.getDate()}`
        }
        this.$store.commit('setLoadingStatus', false);
      } catch (error) {
        this.$toast.fail(`${error}`);
      }
    }
    private formatOverTime(e: number): void {
      const time = new Date(e);
      this.overTime = time.toLocaleDateString().split('/').join('-');
    }
    private chooseCell(index: number): void {
      if (index === 0) {
        this.$router.push(`/mymall?owner=${this.userinfo.owner}&birthday=${this.userinfo.birthday}`);
      } else if (index === 2) {
        this.$router.push(`/comment?role=1`);
      } else if (index === 4) {
        this.isShow = true;
      } else if (index === 6) {
        const { uname, tel, rname, childSex, birthday, gradeClass } = this.userinfo;
        this.$router.push(`/fill_mine?uname=${uname ? uname : ''}&tel=${tel ? tel : ''}&rname=${rname ? rname : ''}&sex=${childSex ? childSex : ''}&grade=${gradeClass ? gradeClass : ''}&birthday=${birthday ? birthday : ''}`);
      } else {
        this.$toast('功能开发中');
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    background-color: #ffffff;
    .swipe_img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    .top {
      padding: 20px;
      background: center / cover;
      background-image: url('./icon/Clip@2x(1).png');
      .info {
        display: flex;
        align-items: center;
        word-break: break-all;
        justify-content: flex-start;
        &>img {
          width: 66px;
          height: 66px;
          object-fit: cover;
          border-radius: 4px;
        }
        .name {
          flex: 1;
          color: #fff;
          margin: 0 20px;
          font-size: 13px;
          .label {
            line-height: 20px;
          }
        }
        .set_img {
          width: 80px;
          height: 80px;
          object-fit: cover;
        }
      }
      .vip {
        display: flex;
        font-size: 13px;
        margin-top: 10px;
        align-items: center;
        background: center / cover;
        justify-content: flex-start;
        padding: 10px 12px 20px 12px;
        background-image: url('./icon/Gradient Overlay@2x.png');
        .vip_icon {
          color: #C8B068;
        }
        .time {
          flex: 1;
          color: #C8B068;
          margin-left: 10px;
        }
        .name {
          color: #fff;
        }
      }
    }
    .my_class {
      margin: 0 20px;
      overflow: hidden;
      margin-top: -30px;
      border-radius: 8px;
      border: 1px solid #ececec;
      .wrapper {
        display: flex;
        padding: 5px 0;
        align-items: center;
        background-color: #fff;
        justify-content: space-between;
        .class_type {
          width: 50%;
          line-height: 20px;
          text-align: center;
        }
      }
    }
    .cell_box {
      display: flex;
      flex-wrap: wrap;
      padding: 20px 0 60px 0;
      align-items: flex-start;
      justify-content: flex-start;
      .cell {
        width: 33%;
        display: flex;
        padding: 10px 0;
        align-items: center;
        flex-direction: column;
        justify-content: flex-start;
        &>img {
          width: 40px;
          height: 40px;
          object-fit: cover;
        }
        &>span {
          font-size: 13px;
          line-height: 25px;
        }
      }
    }
    .end_title {
      left: 0;
      bottom: 0;
      width: 100%;
      color: #000;
      position: fixed;
      text-align: center;
      padding: 12px 0 3px 0;
      background: center / cover;
      background-image: url('./icon/图层 20 拷贝 2@2x.png');
      a:link {
        color: #000;
      }
      a:visited {
        color: #000;
      }
      a:active {
        color: #000;
      }
    }
  }
</style>
