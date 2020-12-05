

<template>
  <div>
    <div v-if="list.length" class="page">
      <div class="class_list">
        <div v-for="(item, index) in list" :key="index" class="class_wrapper">
          <div class="top_info">
            <div class="name">学员：{{item.rname}}</div>
            <a :href="`tel: ${item.tel}`">
              <div class="name">{{item.tel}}</div>
            </a>
          </div>
          <div v-for="({addr, end_time, group_name, name, start_time, week, coach_name}, index) in item.courseEtc" :key="index" class="bottom_info">
            <div class="pos_coach">
              <div class="name">
                <span>{{coach_name}}教练</span>
                <span class="level">{{group_name}} {{name}}</span>
              </div>
              <div class="position">
                <van-icon name="location" size="16px" color="#d8d8d8" />
                <span>{{addr}}</span>
              </div>
            </div>
            <div class="weeks">
              <div class="week_top">{{week}}</div>
              <div class="week_bottom">
                <div>{{start_time}}</div>
                <div style="width: 30px">至</div>
                <div>{{end_time}}</div>
              </div>
            </div>
          </div>
          <div class="btns">
            <div class="pass_btn" @click="type = 2;id = item.id;show = true;index = index">通过</div>
            <div class="reject_btn" @click="type = 3;id = item.id;show = true;index = index">驳回</div>
          </div>
        </div>
      </div>
      <van-dialog v-model="show" :title="type === 2 ? '是否通过' : '是否驳回'" show-cancel-button @confirm="action">
        <van-field v-if="type === 3" v-model="msg" type="textarea" rows="4" label="驳回理由" placeholder="输出驳回理由" />
      </van-dialog>
    </div>
    <van-empty v-else description="暂无数据" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Icon, Popup, Dialog, Field, Empty } from 'vant'
  @Component({
    components: {
      [Icon.name]: Icon,
      [Popup.name]: Popup,
      [Dialog.Component.name]: Dialog.Component,
      [Field.name]: Field,
      [Empty.name]: Empty,
    }
  })
  export default class Login extends Vue {
    private list: any[] = [];
    private size: number = 0;
    private msg: string = '';
    private show: boolean = false;
    private type: number = null;
    private id: string = null;
    private index: number = null;
    protected created(): void {
      this.getDate();
    }
    private beforeDestroy(): void {
      window.removeEventListener('scroll', this.scroll);
    }
    private async action(): Promise<any> {
      this.$toast.loading();
      try {
        const obj = await this.$api({
          url: `/applyCourse/updateApplyCourse`,
          data: {
            id: this.id,
            state: this.type,
            msg: this.msg
          },
        });
        this.$toast(this.type === 2 ? '通过成功' : '驳回成功');
        this.list.splice(this.index, 1);
      } catch (error) {
        this.$toast.fail(error);
      }
    }
    private async getDate(): Promise<any> {
      try {
        const obj = await this.$api({
          url: `/applyCourse/findApplyCourseByRectorId?rectorId=${this.$route.query.rectorId}&page=${this.size}`,
          method: 'get'
        });
        this.list.push(...obj);
        if (this.size === 0) {
          this.$nextTick(() => {
            window.addEventListener('scroll', this.scroll);
          });
        }
        this.$store.commit('setLoadingStatus', false);
      } catch (error) {
        this.$toast.fail(error);
      }
    }
    private scroll(e: any): void {
      const height = document.body.scrollHeight;
      const scrollTop = Math.ceil(document.documentElement.scrollTop + document.documentElement.clientHeight);
      if (scrollTop >= height && this.list.length && this.list.length % 20 === 0) {
        this.size += 1;
        this.getDate();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    padding: 12px;
    background-color: #ececec;
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
          .name {
            width: 120px;
          }
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
        .bottom_info {
          display: flex;
          line-height: 20px;
          align-items: center;
          background-color: #fff;
          padding: 12px 20px 12px 12px;
          justify-content: space-between;
          border-bottom: 1px solid #dddddd;
          .pos_coach {
            width: 55%;
            color: #999999;
            .name {
              display: flex;
              align-items: center;
              margin-bottom: 10px;
              justify-content: space-between;
              .level {
                color: #000;
                font-size: 11px;
              }
            }
            .position {
              display: flex;
              align-items: center;
              justify-content: flex-start;
              &>span {
                margin-left: 3px;
              }
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
        .btns {
          display: flex;
          padding: 15px 20px;
          align-items: center;
          background-color: #fff;
          justify-content: space-between;
          .pass_btn, .reject_btn {
            width: 120px;
            color: #fff;
            line-height: 28px;
            text-align: center;
            border-radius: 6px;
            background-color: #ff6868;
          }
          .reject_btn {
            color: #000;
            background-color: #fff;
            border: 1px solid #cecece;
          }
        }
      }
    }
  }
</style>