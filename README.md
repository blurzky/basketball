# takeout
探街外卖商家端项目

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


## 代码规范
* 参考vant-ui风格指南 https://youzan.github.io/vant/#/zh-CN/style-guide
* 文件夹小写， vue文件驼峰式命名且首字母大写
* 书写代码尽量从下往上书写 例如store里面添加新的state设置在最上面
* 页面最外层已有默认类名container，  实际页面均必须命名为page（默认会占满除了导航栏以外高度）
* 新增路由均按照现在模板书写，完善路由元信息, index代表页面层级， index=0（则直接调用客户端方法返回到外面）
* store新增state必须添加注释
* vant-ui组件 引用[Button.name]: Button => 使用<van-button> 均以这种书写方式
* 新页面均构建在其父级页面之下 例如shop -> shop_info
* z-index 尽量从最低开始设置 0 1 2... 不能超过100