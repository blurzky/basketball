<template>
  <div>
    <custom-nav title="个人主页" border-color="#dbdbdb" />
    <div class="page">
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Button } from 'vant'
  @Component({
    components: {
      [Button.name]: Button
    }
  })
  export default class MyPage extends Vue {
    protected created(): void {
      this.$store.commit('setLoadingStatus', false);
    }
  }
</script>

<style lang="scss" scoped>
  .page {
  }
</style>
