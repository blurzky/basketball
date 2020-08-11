<template>
  <div>
    <div class="page">
      <van-icon name="success" size="60" color="#79f349" />
      <span>提交成功</span>
    </div>
  </div>
</template>


<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Icon } from 'vant'
  @Component({
    components: {
      [Icon.name]: Icon,
    }
  })
  export default class Success extends Vue {
    protected created(): void {
      this.$store.commit('setLoadingStatus', false);
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    display: flex;
    font-size: 24px;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    background-color: #fff;
  }
</style>