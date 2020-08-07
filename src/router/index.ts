import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { Toast } from 'vant'
import store from '../store'

Vue.use(VueRouter).use(Toast)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'login',
    meta: {
      index: 0,
      title: '登录'
    },
    component: () => import('../views/login/Login.vue')
  },
  {
    path: '/mypage',
    name: 'mypage',
    meta: {
      index: 0,
      title: '个人主页'
    },
    component: () => import('../views/my_page/Mypage.vue')
  },
  {
    path: '/test_class',
    name: 'test_class',
    meta: {
      index: 0,
      title: '报名体验课'
    },
    component: () => import('../views/test_class/TestClass.vue')
  },
  {
    path: '/mall',
    name: 'mall',
    meta: {
      index: 0,
      title: '比高篮球-购买课程'
    },
    component: () => import('../views/mall/Mall.vue')
  },
  {
    path: '/*',
    name: 'NotFind',
    meta: {
      index: 10,
      title: '404'
    },
    component: () => import('../views/404/NotFound.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return {
      x: 0,
      y: 0
    }
  }
})

router.beforeEach((to, from, next) => {
  store.commit('setLoadingStatus', true);
  next();
});

export default router
