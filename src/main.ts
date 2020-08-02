import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {mountApi} from './assets/js/api'
import loading from './components/Loading.vue'
import nav from './components/Nav.vue'
import { Toast, Dialog, Lazyload } from 'vant'
import { Component } from 'vue-property-decorator'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave'
])

// 声明全局方法
declare module 'vue/types/vue' {
  interface Vue {
    $api(obj: ApiQuery): Promise<any>;
  }
}

// vant-ui
Toast.setDefaultOptions({duration: 3000})
Toast.setDefaultOptions('loading', { forbidClick: true })

Vue.use(Toast).use(Dialog).use(Lazyload).use(mountApi)

Vue.component('loading', loading)
Vue.component('custom-nav', nav)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
