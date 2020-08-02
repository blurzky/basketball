<template>
  <div>
    <custom-nav title="购买体验课" />
    <div class="page">
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  @Component
  export default class TestClass extends Vue {
    protected created(): void {
      this.$store.commit('setLoadingStatus', false);
    }
  }
</script>

<style lang="scss" scoped>
  .page {
  }
</style>
