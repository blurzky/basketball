# basket
篮球微信公众号项目

## 项目启动操作流程
```
npm install
npm run serve
npm run build
```

## 文件结构
`./assets` 包含一些全局方法，css，图片资源

`./components` 公共组件

`./router` 路由

`./store` vuex

`./views` 页面

## 简便方法
* 客户端传的userid this.$store.state.userid
* 判断手机型号 this.$store.state.phone 1-android 2-刘海屏iphone 3-普通iphone
* 使用.5px的边框，自适应，修改placeholder 参见 `src/assets/sass/main.scss`
* 目前暴露5种全局方法，具体参见 `src/assets/js`
* 目前两种全局组件loading， nav
* 页面切换自动loading， 关闭则调用 `this.$store.commit('setLoadingStatus', false)`, keep-alive特殊情况，需在activated里面进行关闭
* 自定义导航栏目测符合大部分用法，无需引入直接调用，命名为`custom-nav` 属性参见 `src/components/Nav.vue`
* 快捷调用阿里云上传可使用`this.$upload(type, file)` type: string = e.target.files[0].type