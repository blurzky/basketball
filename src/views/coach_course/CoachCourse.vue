<template>
  <div>
    <div class="page">
      <div class="tabs">
        <div class="tab" :class="choose === index ? `choose_tab` : ''" v-for="(item, index) in tabs" :key="index" @click="choose = index">{{item}}</div>
      </div>
      <Canlendar v-if="choose === 1" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Button } from 'vant'
  @Component({
    components: {
      [Button.name]: Button,
      Canlendar: () => import('../../components/Canlendar.vue')
    }
  })
  export default class CoachCourse extends Vue {
    private choose: number = 0;
    private tabs: string[] = ['即将开始', '全部'];
    protected created(): void {
      this.$store.commit('setLoadingStatus', false);
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    padding-top: 20px;
    background-color: #ececec;
    .tabs {
      width: 200px;
      display: flex;
      margin: 0 auto;
      overflow: hidden;
      align-items: center;
      border-radius: 12px;
      border: 1px solid #2183f3;
      justify-content: space-between;
      .tab, .choose_tab {
        width: 50%;
        font-size: 16px;
        padding: 6px 10px;
        text-align: center;
        transition: all .3s;
      }
      .choose_tab {
        color: #fff;
        background-color: #2183f3;
      }
    }
  }
</style>