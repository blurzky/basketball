import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loadingStatus: true, // 页面切换时loading状态
    phone: 1, // 1android 2刘海屏iphone 3iphone
    userid: null, // 用户id
    star: null // 星级
  },
  mutations: {
    setLoadingStatus(state, res) {
      state.loadingStatus = res;
    },
    setPhone(state) {
      if (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1) {
        state.phone = 1;
      } else if (/iphone/gi.test(navigator.userAgent) && screen.height >= 812 && screen.width >= 375) {
        state.phone = 2;
      } else {
        state.phone = 3;
      }
    },
    saveUserid(state, res) {
      state.userid = res;
    },
    saveStar(state, res) {
      state.star = res;
    },
  }
})
