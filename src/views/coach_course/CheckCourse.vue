<template>
  <div>
    <div class="page">
      
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
  export default class CheckCourse extends Vue {
    private choose: number = 0;

    protected created(): void {
      this.$store.commit('saveUserid', 64);
      this.$store.commit('setLoadingStatus', false);
    }
    private chooseModel(): void {
    }
    private async addSubmit(): Promise<any> {
    }
  }
</script>

<style lang="scss" scoped>
.page {

}
</style>