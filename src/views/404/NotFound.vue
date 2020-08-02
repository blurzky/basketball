<template>
  <div>
    <custom-nav title="未知页面" type="dark" />
    <div class="page">404</div>
  </div>
</template>


<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  @Component
  export default class NotFind extends Vue {
    protected created(): void {
      this.$store.commit('setLoadingStatus', false);
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    font-size: 60px;
    line-height: 80vh;
    text-align: center;
  }
</style>