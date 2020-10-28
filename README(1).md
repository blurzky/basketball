<h1 style="text-align: center">EL-ADMIN 后台管理系统</h1>
<div style="text-align: center">

[![AUR](https://img.shields.io/badge/license-Apache%20License%202.0-blue.svg)](https://github.com/elunez/eladmin/blob/master/LICENSE)
[![star](https://gitee.com/elunez/eladmin/badge/star.svg?theme=white)](https://gitee.com/elunez/eladmin)
[![GitHub stars](https://img.shields.io/github/stars/elunez/eladmin.svg?style=social&label=Stars)](https://github.com/elunez/eladmin)
[![GitHub forks](https://img.shields.io/github/forks/elunez/eladmin.svg?style=social&label=Fork)](https://github.com/elunez/eladmin)

</div>

#### 项目简介
一个基于 Spring Boot 2.1.0 、 Spring Boot Jpa、 JWT、Spring Security、Redis、Vue的前后端分离的后台管理系统

**开发文档：**  [https://el-admin.vip](https://el-admin.vip)

**体验地址：**  [https://el-admin.xin](https://el-admin.xin)

**账号密码：** `admin / 123456`

#### 项目源码

|     |   后端源码  |   前端源码  |
|---  |--- | --- |
|  github   |  https://github.com/elunez/eladmin   |  https://github.com/elunez/eladmin-web   |
|  码云   |  https://gitee.com/elunez/eladmin   |  https://gitee.com/elunez/eladmin-web   |

#### 主要特性
- 使用最新技术栈，社区资源丰富。
- 高效率开发，代码生成器可一键生成前后端代码
- 支持数据字典，可方便地对一些状态进行管理
- 支持接口限流，避免恶意请求导致服务层压力过大
- 支持接口级别的功能权限与数据权限，可自定义操作
- 自定义权限注解与匿名接口注解，可快速对接口拦截与放行
- 对一些常用地前端组件封装：表格数据请求、数据字典等
- 前后端统一异常拦截处理，统一输出异常，避免繁琐的判断
- 支持在线用户管理与服务器性能监控，支持限制单用户登录
- 支持运维管理，可方便地对远程服务器的应用进行部署与管理

####  系统功能
- 用户管理：提供用户的相关配置，新增用户后，默认密码为123456
- 角色管理：对权限与菜单进行分配，可根据部门设置角色的数据权限
- 菜单管理：已实现菜单动态路由，后端可配置化，支持多级菜单
- 部门管理：可配置系统组织架构，树形表格展示
- 岗位管理：配置各个部门的职位
- 字典管理：可维护常用一些固定的数据，如：状态，性别等
- 系统日志：记录用户操作日志与异常日志，方便开发人员定位拍错
- SQL监控：采用druid 监控数据库访问性能，默认用户名admin，密码123456
- 定时任务：整合Quartz做定时任务，加入任务日志，任务运行情况一目了然
- 代码生成：高灵活度生成前后端代码，减少大量重复的工作任务
- 邮件工具：配合富文本，发送html格式的邮件
- 免费图床：使用sm.ms图床，用作公共图片上传使用，该图床不怎么稳定，不太建议使用
- 七牛云存储：可同步七牛云存储的数据到系统，无需登录七牛云直接操作云数据
- 支付宝支付：整合了支付宝支付并且提供了测试账号，可自行测试
- 服务监控：监控服务器的负载情况
- 运维管理：一键部署你的应用

#### 项目结构
项目采用按功能分模块的开发方式，结构如下

- `eladmin-common` 为系统的公共模块，各种工具类，公共配置存在该模块

- `eladmin-system` 为系统核心模块也是项目入口模块，也是最终需要打包部署的模块

- `eladmin-logging` 为系统的日志模块，其他模块如果需要记录日志需要引入该模块

- `eladmin-tools` 为第三方工具模块，包含：图床、邮件、云存储、本地存储、支付宝

- `eladmin-generator` 为系统的代码生成模块，代码生成的模板在 system 模块中

#### 详细结构

```
- eladmin-common 公共模块
    - annotation 为系统自定义注解
    - aspect 自定义注解的切面
    - base 提供了Entity、DTO基类和mapstruct的通用mapper
    - config 自定义权限实现、redis配置、swagger配置、Rsa配置等
    - exception 项目统一异常的处理
    - utils 系统通用工具类
- eladmin-system 系统核心模块（系统启动入口）
	- config 配置跨域与静态资源，与数据权限
	    - thread 线程池相关
	- modules 系统相关模块(登录授权、系统监控、定时任务、运维管理等)
- eladmin-logging 系统日志模块
- eladmin-tools 系统第三方工具模块
- eladmin-generator 系统代码生成模块
```
    
#### 系统预览
<table>
    <tr>
        <td><img src="https://img.el-admin.xin/20200605172248.png"/></td>
        <td><img src="https://img.el-admin.xin/20200605172339.png"/></td>
    </tr>
    <tr>
        <td><img src="https://img.el-admin.xin/20200605172432.png"/></td>
        <td><img src="https://img.el-admin.xin/20200605172455.png"/></td>
    </tr>
    <tr>
        <td><img src="https://img.el-admin.xin/20200605172536.png"/></td>
        <td><img src="https://img.el-admin.xin/20200605172558.png"/></td>
    </tr>
    <tr>
        <td><img src="https://img.el-admin.xin/20200605172645.png"/></td>
        <td><img src="https://img.el-admin.xin/20200605172715.png"/></td>
    </tr>
</table>

#### 特别鸣谢

- 感谢 [JetBrains](https://www.jetbrains.com/) 提供的非商业开源软件开发授权

- 感谢 [PanJiaChen](https://github.com/PanJiaChen/vue-element-admin) 大佬提供的前端模板

- 感谢 [Moxun](https://github.com/moxun1639) 大佬提供的前端 Curd 通用组件

- 感谢 [zhy6599](https://gitee.com/zhy6599) 大佬提供的后端运维管理相关功能

- 感谢 [j.yao.SUSE](https://github.com/everhopingandwaiting) 大佬提供的匿名接口与Redis限流等功能

- 感谢 [d15801543974](https://github.com/d15801543974) 大佬提供的基于注解的通用查询方式

#### 项目捐赠
项目的发展离不开你的支持，请作者喝杯咖啡吧☕  [Donate](https://el-admin.vip/donation/)

#### 反馈交流
- QQ交流群：891137268

### 接口文档
#############################
选课接口：
http://bigao.nhgk.shop/api/courseEtc/findRemaCourseByBirthDay
请求方式：GET
参数：birthday
返回的数据结构：
[{
 "id": 3,
 "week": "每周上课是星期几",
 "addr": "训练场地地址",
 "startTime": "每天上课时间",
 "endTime": "每天上课结束时间",
 "coachId": 13,
 "coachName": "教练名称",
 "state": 1,
 "allowpeples": "还可以报名多少个人",
 "groupName": "组别"
}]
###############################
产品数据的请求接口：
http://bigao.nhgk.shop/api/courseMudle/findBuyCourseMudle
返回的数据结构：
[{
 "name": "课程产品名称",
 "state": 1,
 "time": 1591264567000,
 "week": "总周数",
 "number": "每周上几次课",
 "id": 8,
 "allcounts": "总上课次数",
 "type": 2
}]
###############################
上传体验课：
https://bigao.nhgk.shop/api/courseTrial/applyCourseTrial
请求参数：
{
	"addr": "星光大道",
	"date": "",
	"userid": "52",
	"courseMudleId": "1",
	"gradleClass": "二年级",
	"rname": "学员姓名",
	"tel": "电话号码",
	"birthday": "出生日期",
	"inviteUser": "邀请用户的主键",
	"paymenttype": "缴费类型主键",
	"courseEtc": [{
		"id": "选课接口中返回的id"
	}]
}
###############################
查询用户个人中心数据：
https://bigao.nhgk.shop/api/courseRema/findById
请求参数：userid GET 请求
返回数据：
{
	"userid": "用户主键",
	"buySum": "总购买课程数",
	"vipOutTime": "vip到期时间-时间戳",
	"eveWeek": "每周可以上课次数",
	"remaSum": "总剩余课程数",
	"remaWeek": "本周剩余课程数",
	"ctime": "数据插入的时间戳-无用",
	  //选课信息
	"courseEtc": [{
		"id": 5,
		"week": "星期一",
		"addr": "上课地点",
		"startTime": "开始上课的时间：19:00",
		"endTime": "结束上课的时间：20:00",
		"coachId": "教练编号",
		"coachName": "教练名称",
		"allowpeples": "还可以报名",
		"groupName": "组别"
	}],
	//用户信息
	"beeagleUsers": {
		"userid": 52,
		"soid": null,
		"goid": null,
		"ctime": 1593617175000,
		"head": null,
		"uname": "小刘",
		"sex": null,
		"tel": "13540497299",
		"role": 1,
		"rname": "小刘",
		"childSex": 1,
		"parentName": null,
		"gradeClass": null
	}
}
###########################################
购买产品：
https://bigao.nhgk.shop/api/coursePayUser/buyCourse
请求参数：
{
	"uname": "链接地址上的name字段值",
	"birthday": "生日日期",
	"stime": "会员开始日期",
	"etime": "会员结束日期",
	"paymenttype": "消费类型主键",
	"tel": "18332558202",
	"courseId": "产品主键",
	"week": "课程多少周：选择产品的时候里面有",
	"quip": "装备性质",
	"mark": "备注信息",
	"money": "实际收款金额：单位元",
	"payee": "选择的收款人对应的userid",
	"sex": "性别：1-男 2-女",
	"userid": "链接地址上的userid字段值",
	"inviteUser": "转介绍老顾客的userid",
	"giveCourse": "赠送课程：选择产品的时候里面有",
	"myuserid": "自己登陆的用户ID",
	"courseEtc": [{
		"id": "课程主键"
	}]
}
#############################################
公众号登录：
https://api.nhgk.shop/api/beeagleUsers/findByGoid
#############################################
 查询邀请人列表：
 https://bigao.nhgk.shop/api/beeagleUsers/findBeaagleUsers
 GET请求，无参
 返回的数据：
 [{
 	"uname": "用户名",
 	"userid": "主键",
 	"rname": "孩子姓名"
 }]
############################################
 查询缴费类型：
 https://bigao.nhgk.shop/api/paymentType/findPaymentType
 GET请求，无参
  返回的数据：
  [{
  	"id": "主键",
  	"name": "类型名称"
  }]
###########################################
 获取微信分享的数据：
  https://bigao.nhgk.shop/api/beeagleUsers/wjcode
  POST，非JSON传参，参数：url=当前请求的网址
  返回的参数：
  {
     "signature": "a4102b21c26bbeffadc0d38d474d08fcb7be9e89",
     "nonceStr": "f2d18141-773a-4220-8244-fd6746aee3eb",
     "timestamp": "1597127829"
  }
###########################################
 查询教练上课打分：
  https://bigao.nhgk.shop/api/course/findCoachCommentList
  POST，非JSON传参，参数：userid=用户主键&page=页数&type=1/2(1-未打分；2-已打分)
  返回参数：
[{
	"coachCommentId": "教练打分表主键",
	"coachStudyGrade": "教练对学员教学内容评分：满分五分",
	"coach_name": "教练名称",
	"week": "星期几",
	"coachDisGrade": "教练对学员纪律评分：满分5分",
	"uname": "学员名字",
	"coachComment": "教练对学员的详细评价内容",
	"userCourseGrade": "家长对教练的评分：满分五分",
	"userDisGrade": "家长对教练上课纪律评分:满分五分",
	"userid": "用户主键",
	"userStudyGrade": "家长对学习内容评分“满分五分",
	"course_etc_id": "",
	"coach_id": "教练主键",
	"medias": "[{\"media_url\":\"图片/视频路径\",\"type\":1-图片 4-视频}]",
	"etime": "结束上课时间",
	"id": "课程主键",
	"time": "开始上课时间",
	"addr": "地址"
}]
###########################################
  查询家长上课打分：
   https://bigao.nhgk.shop/api/course/findUserEvalumentList
   POST，非JSON传参，参数：userid=用户主键&page=页数&type=1/2(1-未打分；2-已打分)
   返回参数：
   [{
   	"coachStudyGrade": "教练对学员教学内容评分：满分五分",
   	"coach_name": "教练名称",
   	"week": "星期几",
   	"coachDisGrade": "教练对学员纪律评分：满分5分",
   	"uname": "学员名字",
   	"coachComment": "教练对学员的详细评价内容",
   	"userCourseGrade": "家长对教练的评分：满分五分",
   	"userDisGrade": "家长对教练上课纪律评分:满分五分",
   	"userid": "用户主键",
   	"userStudyGrade": "家长对学习内容评分“满分五分",
   	"remark": "家长对教练的详细评价",
   	"course_etc_id": "",
   	"coach_id": "教练主键",
   	"medias": "[{\"media_url\":\"图片/视频路径\",\"type\":1-图片 4-视频}]",
   	"etime": "结束上课时间",
   	"id": "课程主键",
   	"time": "开始上课时间",
   	"addr": "地址"
   }]   
#############################################
  教练打分：
  https://bigao.nhgk.shop/api/coachComment/updateCoachComment
  POST,JSON传参
  请求参数：
  {
  	"comment": "评价内容",
  	"courseId": "课程主键",
  	"disGrade": "记录分数",
  	"id": "主键",
  	"studysGrade": "学习打分",
  	"userid": "登录人的账号ID"
  }
#############################################
  家长打分：
  https://bigao.nhgk.shop/api/evaluate/addEvaluate
  POST，JSON传参
  请求参数：
  {
  	"courseId": "课程主键",
  	"courseGrade": "课程打分：最高五分",
  	"disGrade": "上课纪律打分：最高五分",
  	"studyGrade": "学习内容打分：最高五分",
  	"userid": "登录的主键",
  	"remark": "评价的内容",
  	"coachId": "教练主键"
  }
#############################################
 查询校长接口：
 https://bigao.nhgk.shop/api/coursePayUser/findRector
 GET请求，无参
 返回值：
 [{
 	"phone": "电话号码",
 	"user_id": "校长用户主键",
 	"gender": "性别",
 	"username": "用户名字",
 	"dept_id": 7,
 	"nick_name": "显示的名字"
 }] 
###########################################
上传图片/视频接口
 https://bigao.nhgk.shop/api/courseMedia/addCourseMedia
POST
参数：
{
	"type": "返回值",
	"mediaUrl": "图片/视频路径",
	"courseId": "课程编号",
	"sort": "序号"
}
###########################################
用户上课通知确认内容接口：
 https://bigao.nhgk.shop/api/course/findCourseInfoById
POST
参数： courseId=课程主键
    返回值：
    {
        "addr": "上课地点",
        "coach_name": "教练名字",
        "phone": "联系电话",
        "week": "星期三",
        "end_time": "19:00",
        "id": "课程主键",
        "start_time": "18:00"
    }
###########################################
用户上课通知内容上传接口：
 https://bigao.nhgk.shop/api/courseStudent/updateCourseStudent
 POST
 参数：courseId=课程主键&userid=用户主键&state=3:不能上课；4:能上课&remark=不能上课的原因（能上课则不传）

 
##########################################
查询统计数据接口：
  https://bigao.nhgk.shop/api/courseTrial/findTongjiData
  参数：userid=用户主键&sTime=选择的开始日期（没有传空）&eTime=选择的结束日期（没有传空）&size=页数&type=1-已引流 2-待转化 3-已转化
 {
 	"daizh": "待转化数量",
 	"list": [{
 		"tel": "电话号码",
 		"rname": "真实姓名",
 		"start_time": "开始上课时间",
 		"week": "开始下课时间",
 		"birthday": "生日",
 		"end_time": "结束上课的时间",
 		"ctime": "数据插入日期",
 		"addr": "地址",
 		"gradle_class": "年级"
 	}],
 	"yizh": "已转化数量",
 	"yinliu": "已引流数量",
 	"radio": "效率"
 }
##########################################
完善个人资料接口：
  https://bigao.nhgk.shop/api/beeagleUsers/updateUserInfo
  参数：
 {
 	"userid": "登录的用户ID",
 	"uname": "昵称",
 	"tel": "电话号码",
 	"rname": "孩子真是姓名",
 	"childSex": "孩子性别：0-女 1-男",
 	"gradeClass": "年级"
 }
########################################
脚本：通知有课的用户上课
https://bigao.nhgk.shop/api/course/noticeClassRemeder
##########################################
教练课程表：即将开始上课数据：
  https://bigao.nhgk.shop/api/course/findCoursesByUserid
  参数：
  userid=登录的用户ID
  返回参数：
  {
  	"courseName": "篮球常规课",
  	"courseId": "课程主键",
  	"addr": "地址",
  	"week": "星期几",
  	"start_time": "18:00",
  	"end_time": "19:00",
  	"state": "上课状态：1-等待教案 2-等待上课 3-正在上课 4-结束 0-还未排课",
  	"people": "上课人数",
  	"date": "2020.09.10"
  }
##########################################
教练课程表：整个月的数据：
  https://bigao.nhgk.shop/api/course/findDayCourse
  参数：
  date=每个月1号日期(例如：2020-10-01)&userid=登录的用户ID
  返回参数：
  {
  	"day": "日期",
  	"isHave": "0-无课程；大于0-有课"
  }
##########################################
教练课程表：每天的数据：
  https://bigao.nhgk.shop/api/course/findDayCourseInfo
  参数：
  userid=登录的用户ID&date=日期
  返回参数：
  {
  	"courseName": "篮球常规课",
  	"addr": "地址",
  	"week": "星期几",
  	"start_time": "18:00",
  	"end_time": "19:00",
  	"state": "上课状态：1-等待教案 2-等待上课 3-正在上课 4-结束 0-还未排课"
  }
##########################################
上传教案：获取教案模板数据
  https://bigao.nhgk.shop/api/teachingMudle/getTeachingMudle
  参数：无参
  返回参数：
  {
      "id": "模板主键",
      "title": "模板教案标题",
      "stage": "模板教案道具",
      "infos": "模板教案教学内容",
      "train_time": "模板教案教学时长"
  }
##########################################
教案课程表：教练列表数据
  https://bigao.nhgk.shop/api/teachingPlan/findTeachingPlan
  参数：userid=用户主键&courseId=课程主键
  返回参数：
  {
  	"course_id": "课程主键",
  	"coach_id": "教练主键",
  	"id": "教案主表主键",
  	"state": "状态：1-待审核 2-审核通过 3-审核不通过",
  	"list": [{
  		"id": "主键",
  		"teachingPlanId": "教案主表主键",
  		"teachingMudleId": "教案模板主键",
  		"coachId": "教练主键",
  		"title": "教案标题",
  		"stage": "教案道具",
  		"infos": "教案内容",
  		"sort": "序号",
  		"trainTime": "教案时长",
  		"status": 1
  	}],
  	"mark": "驳回信息"
  }
 ##########################################
 上传教案：上传教案数据
   https://bigao.nhgk.shop/api/teachingPlanInfo/addTeachingPlanInfo
   参数：
   {
   	"teachingPlanId": "上面接口返回的教案表主键",
   	"teachingMudleId": "选择的教案模板主键",
   	"coachId": "上面接口返回的教练主键",
   	"title": "教案标题",
   	"stage": "教案道具",
   	"infos": "教案内容",
   	"sort": "序号",
   	"trainTime": "教案时长",
   	"status": 1
   }
   返回参数：
   {
   	"id": "主键",
   	"teachingPlanId": "教案主表主键",
   	"teachingMudleId": "教案模板主键",
   	"coachId": "教练主键",
   	"title": "教案标题",
   	"stage": "教案道具",
   	"infos": "教案内容",
   	"sort": "序号",
   	"trainTime": "教案时长",
   	"status": 1
   }
 ##########################################
 上传教案：修改教案数据
   https://bigao.nhgk.shop/api/teachingPlanInfo/updateTeachingPlanInfo
   参数：
   {
       "id": "主键",
       "teachingPlanId": "教案主表主键",
       "teachingMudleId": "教案模板主键",
       "coachId": "教练主键",
       "title": "教案标题1",
       "stage": "教案道具",
       "infos": "教案内容",
       "sort": "序号",
       "trainTime": "教案时长",
       "status": 1
   }
   返回参数：httpResponse=200
 ##########################################
 上传教案：删除教案数据
   https://bigao.nhgk.shop/api/teachingPlanInfo/deleteTeachingPlanInfo
   参数："id"="主键"
   返回参数：httpResponse=200
 ##########################################
 审核教案：教案通过/驳回功能
   https://bigao.nhgk.shop/api/teachingPlan/auditTeachingPlan
   参数：无参
   返回参数：
   {
   	"courseId": "课程主键",
   	"coachId": "教练主键",
   	"id": "教案主键主键",
   	"state": "状态：1-待审核 2-审核通过 3-审核不通过",
   	"mark": "驳回信息"
   }
 ##########################################
 教练课程表：结束上课
   https://bigao.nhgk.shop/api/course/finshCourse
   参数：courseId=课程主键&coachId=教练主键
   返回参数：httpResponse=200
 ##########################################
 公众号：拿取审核教案的列表内容
   https://bigao.nhgk.shop/api/teachingPlan/findRectorListTp
   参数：userid=登录的用户主键&size=页数
   返回参数：
   [{
   	"date": "上课日期：2020.10.25",
   	"tpId": "教案主键",
   	"week": "星期天",
   	"coach_name": "教练名字",
   	"end_time": "当天上课时间：19:00",
   	"tpState": 1,
   	"list": [{
   		"id": "教案内容主键",
   		"teachingPlanId": "教案主键",
   		"teachingMudleId": "教案模板主键",
   		"coachId": "教练主键",
   		"title": "教案标题",
   		"stage": "教案道具",
   		"infos": "教案内容",
   		"sort": "序号",
   		"trainTime": "教案时长",
   		"status": 1
   	}],
   	"start_time": "当天下课时间：18:00",
   	"course_etc_id": "课程配置主键",
   	"coach_id": "教练主键",
   	"etime": "结束上课时间",
   	"ctime": "开始上课时间",
   	"courseId": "课程主键",
   	"addr": "上课的地址",
   	"mark": "审核教案备注，默认null"
   }]
 ##########################################
 公众号：审核教案-提醒教练按钮
   https://bigao.nhgk.shop/api/teachingPlan/remindCoach
   参数：courseId=课程主键&coachId=教练主键
   返回参数：httpResponse=200
 ##########################################
 公众号：学员签到界面
   https://bigao.nhgk.shop/api/course/findStudentByCourseId
   参数：courseId=课程主键
   返回参数：
   [{
   	"id": "该数据主键",
   	"courseId": "课程主键（课程编号）",
   	"userid": "学员用户主键",
   	"uname": "用户名字",
   	"state": "状态：1-未确认是否到场 2-已签到 3-不能到场 4-确认可以到场",
   	"remark": "备注信息",
   	"ctime": "签到时间",
   	"stime": "用户确认时间"
   }]
 ##########################################
 公众号：校长签到学员-扣课
   https://bigao.nhgk.shop/api/course/confirmCourseStudent
   参数：courseId=课程主键&studentId=学员用户主键&userid=当前登录的用户主键
   返回参数：httpResponse=200
 ##########################################
 公众号：校长签到学员-新增学员-下拉框数据
   GET请求 https://bigao.nhgk.shop/api/courseStudent/findCourseStudens?courseId=课程主键
   返回参数：
   [{
   	"rname": "用户真实名字-选择之后上传到后台的数据",
   	"uname": "用户名字-无用",
   	"sex": "性别-不要",
   	"rema_sum": "剩余课程数",
   	"userid": "学员用户主键",
   	"rema_week": "每周剩余课程数-不要"
   }]
 ##########################################
 公众号：校长签到学员-新增学员
   https://bigao.nhgk.shop/api/courseStudent/addCourseStudent
   参数：
   {
   	"courseId": "课程主键（课程编号）",
   	"userid": "用户主键",
   	"uname": "用户名字",
   	"state": 2(值固定),
   	"remark": "备注信息"
   }
   返回参数：
   {
    "id": "该数据主键",
    "courseId": "课程主键（课程编号）",
    "userid": "学员用户主键",
    "uname": "用户名字",
    "state": "状态：1-未确认是否到场 2-已签到 3-不能到场 4-确认可以到场",
    "remark": "备注信息",
    "ctime": "签到时间",
    "stime": "用户确认时间"
  }
