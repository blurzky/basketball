
<template>
  <div>
    <div class="page">
      <div class="top">
        <span>已选课程:</span>
        <van-button round size="small" type="info" @click="getClassList">重新选课</van-button>
      </div>
      <div class="class_list">
        <div v-for="(item, index) in list" :key="index" class="class_wrapper">
          <div class="top_info">
            <div class="name_tel">
              <div class="name">教练：{{item.coach_name}}</div>
              <a :href="`tel: ${item.phone}`">
                <div class="name">{{item.phone}}</div>
              </a>
            </div>
            <div class="job">{{item.job}}</div>
            <div class="class_name">
              <div class="class_number">{{item.group_name}}</div>
              <div class="class_number">{{item.name}}</div>
            </div>
          </div>
          <div class="bottom_info">
            <div class="position">
              <van-icon name="location" size="16px" color="#d8d8d8" />
              <span>{{item.addr}}</span>
            </div>
            <div class="weeks">
              <div class="week_top">{{item.week}}</div>
              <div class="week_bottom">
                <div>{{item.start_time}}</div>
                <div style="width: 30px">至</div>
                <div>{{item.end_time}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-popup v-model="showPickClass" class="check_popup" position="bottom" :style="{ height: '70%' }">
      <van-checkbox-group v-model="myChooseClass">
        <van-checkbox v-for="(item, index) in classesList" :key="index" :name="index" class="check_box">{{item}}</van-checkbox>
      </van-checkbox-group>
      <div class="choose_btn">
        <van-button type="info" round size="small" :style="{width: `80px`}" @click="submitClass">确认</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Button, Icon, Checkbox, CheckboxGroup, Popup } from 'vant'
  @Component({
    components: {
      [Button.name]: Button,
      [Icon.name]: Icon,
      [Checkbox.name]: Checkbox,
      [CheckboxGroup.name]: CheckboxGroup,
      [Popup.name]: Popup,
    }
  })
  export default class Login extends Vue {
    private showPickClass: boolean = false;
    private myChooseClass: string[] = [];
    private myChooseClassId: any[] = [];
    private classesList: any[] = [];
    private classIdList: any[] = [];
    private list: any[] = [];
    protected created(): void {
      this.getList();
    }
    private async getList(): Promise<any> {
      try {
        const obj = await this.$api({
          url: `/courseRema/getCourseInfoList?userid=${this.$store.state.userid}`,
          method: 'get'
        });
        this.list = obj;
        this.$store.commit('setLoadingStatus', false);
      } catch (error) {
        this.$toast.fail(`${error}`);
      }
    }
    private async submitClass(): Promise<any> {
      this.myChooseClassId = [];
      this.myChooseClass.forEach((e: any) => {
        this.myChooseClassId.push({id: this.classIdList[e]});
      });
      this.$toast.loading();
      try {
        const obj = await this.$api({
          url: `/applyCourse/addApplyCourse`,
          data: {
            userid: this.$store.state.userid,
            courseEtc: this.myChooseClassId
          },
          form: false,
          headers: 'json',
        });
        this.$toast('审核中');
        this.showPickClass = false;
      } catch (error) {
        this.$toast.fail(error);
      }
    }
    private async getClassList(): Promise<any> {
      this.classesList = [];
      this.classIdList = [];
      this.$toast.loading();
      try {
        const { userid } = this.$store.state;
        const { birthday, owner } = this.$route.query;
        const obj = await this.$api({
          url: `/courseEtc/findCourseListByApply?birthday=${birthday}&owner=${owner}&userid=${userid}`,
          method: 'get'
        });
        obj.forEach((e: any) => {
          this.classesList.push(`${e.addr} 【${e.week} ${e.startTime}-${e.endTime}】 组别:${e.groupName} 剩余:${e.allowpeples}\n`);
          this.classIdList.push(e.id);
        })
        this.$toast.clear();
        this.showPickClass = true;
      } catch (error) {
        this.$toast(error);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    padding: 56px 12px 12px;
    background-color: #ececec;
    .top {
      top: 0;
      left: 0;
      z-index: 10;
      width: 100%;
      padding: 12px;
      display: flex;
      padding: 12px;
      position: fixed;
      align-items: center;
      box-sizing: border-box;
      background-color: #ececec;
      justify-content: space-between;
      &>span {
        font-size: 16px;
      }
    }
    .class_list {
      .class_wrapper {
        overflow: hidden;
        border-radius: 12px;
        margin-bottom: 20px;
        .top_info {
          color: #fff;
          display: flex;
          line-height: 20px;
          text-align: center;
          align-items: center;
          padding: 12px 20px 12px 0;
          background-color: #ff6868;
          justify-content: space-between;
          .name_tel {
            width: 120px;
            a:link {
              color: #fff;
            }
            a:visited {
              color: #fff;
            }
            a:active {
              color: #fff;
            }
          }
          .job {
            width: 80px;
          }
          .class_name {
            width: 70px;
            padding: 5px;
            color: #000;
            background-color: #fff
          }
        }
        .bottom_info {
          display: flex;
          line-height: 20px;
          align-items: center;
          background-color: #fff;
          padding: 12px 20px 12px 12px;
          justify-content: space-between;
          .position {
            width: 50%;
            display: flex;
            color: #999999;
            align-items: center;
            justify-content: flex-start;
            &>span {
              margin-left: 3px;
            }
          }
          .weeks {
            width: 40%;
            overflow: hidden;
            text-align: center;
            border-radius: 6px 6px 0 0;
            .week_top {
              color: #fff;
              background-color: #ffa136;
            }
            .week_bottom {
              display: flex;
              padding: 5px 20px;
              align-items: center;
              border: 1px solid #ececec;
              justify-content: space-between;
            }
          }
        }
      }
    }
  }
  .check_popup {
    padding: 20px;
    box-sizing: border-box;
    .check_box {
      margin-bottom: 20px;
    }
    .choose_btn {
      width: 100%;
      text-align: center;
    }
  }
</style>