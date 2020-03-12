# EasyQuestionnaire-web

#### 一个问卷调查平台

##### 后端项目地址：https://github.com/yuzhanglong/EasyQuestionnaire-backend

##### API接口文档 : https://www.showdoc.cc/EasyQuestionnaire



## 项目结构

```
├─ .gitignore
├─ README.md
├─ babel.config.js
├─ public
│  └─ index.html
├─ src
│  ├─ assets
│  ├─ components
│  │  ├─ bScroll
│  │  │  └─ bScroll.vue
│  │  ├─ dataCard
│  │  │  ├─ dataCard.vue
│  │  │  └─ puleDataCard.vue
│  │  ├─ leftNavBar
│  │  │  └─ leftNavBar.vue
│  │  ├─ myCharts
│  │  │  ├─ chinaMap.vue
│  │  │  └─ pieChart.vue
│  │  ├─ navBar
│  │  │  └─ navBar.vue
│  │  ├─ scrollBar
│  │  │  └─ scrollBar.vue
│  │  └─ stepBar
│  │     └─ stepBar.vue
│  ├─ network
│  │  ├─ analysis.js
│  │  ├─ complete.js
│  │  ├─ questionnaire.js
│  │  ├─ questionnaireEdition.js
│  │  ├─ user.js
│  │  └─ request.js
│  ├─ router
│  │  └─ index.js
│  ├─ utils
│  │  ├─ loading.js
│  │  └─ messageBox.js
│  ├─ views
│  │  ├─ analysis
│  │  │  ├─ ChlidComp
│  │  │  │  ├─ chartBackground.vue
│  │  │  │  └─ globalChartBackground.vue
│  │  │  └─ analysis.vue
│  │  ├─ complete
│  │  │  ├─ childComp
│  │  │  │  └─ secretInput.vue
│  │  │  └─ complete.vue
│  │  ├─ create
│  │  │  ├─ childComp
│  │  │  │  ├─ popOver.vue
│  │  │  │  ├─ problemTypeItem.vue
│  │  │  │  ├─ problemCard.vue
│  │  │  │  └─ basicInfo.vue
│  │  │  └─ questionnaire.vue
│  │  ├─ home
│  │  │  └─ home.vue
│  │  ├─ login
│  │  │  └─ login.vue
│  │  ├─ manage
│  │  │  ├─ childComp
│  │  │  │  └─ templateList.vue
│  │  │  └─ manage.vue
│  │  ├─ register
│  │  │  └─ register.vue
│  │  ├─ spread
│  │  │  ├─ childComp
│  │  │  │  ├─ npsSelector.vue
│  │  │  │  └─ projectShare.vue
│  │  │  └─ spread.vue
│  │  └─ success
│  │     └─ success.vue
│  ├─ main.js
│  ├─ App.vue
│  └─ models
│     ├─ response_model.js
│     ├─ questionnaire_model.js
│     └─ analysis_model.js
├─ vue.config.js
├─ node_modules
├─ questionnaire.conf
├─ package.json
└─ package-lock.json
```



## 当前功能

##### 1.登录注册 邮箱验证 等用户的基本操作
##### 2.创建问卷以供填报（支持题型：单选题 多选题 填空题 下拉题）
##### 3.对你当前所拥有的问卷进行增删改  支持问卷模板一键生成问卷
##### 4.问卷发布功能（基本的发布/停止发布功能 设置问卷密码 限制ip或者设备重复访问）
##### 5.问卷数据分析 对某个问卷收集的数据进行数据可视化分析