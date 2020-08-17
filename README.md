# EasyQuestionnaire-web
### 2020-8-17更新

#### 一直没有机会重构这个项目（当前版本可以正常使用，但是已经有了一些优化的思路),  等过一段时间空了再来处理吧，我大概描述一下我准备去做的一个优化方案，供参考：

### 前端：

- 前端可以在**当前的基础上**封装一个**表单编辑器**组件，**约定好数据结构**，这个编辑器不仅仅能够支持问卷，还可以支持考试、业务表单办理等功能。
- 准备拥抱**vue3、typescript**

### 服务端：

- 服务端还是采用**mongodb**这个**nosql**数据库(其实说它是个关系型数据库也不为过～)，当然，**mysql**当然也是一个不错的选择，各有各的好处。

- 问卷提交的过程处理：

  1. **数据处理**: 如果使用**mongodb**（例如本项目)，数据的插入是非常方便的，但是**如果严谨些**，需要考虑数据格式验证的问题，如果使用mysql，结合json格式的字段，那么处理起来也不会太难。

  2. **数据统计**: **当前本项目**的数据统计是直接通过调取接口 -- 查表 -- 进行计算的，**个人用用的小项目还可以**，但是如果数据量一大（例如某个问卷的**问题很多**），那么就会出现大量查表计算的情况，这个可能比较耗时，我们可以：

     - 采用redis缓存，每次用户填写完表单，服务端返回给用户**200**之后，后台**重新计算表单统计信息**，同步存入**redis**和**db**，这样问卷发布者调取数据分析接口之后**只需要**从redis**获取统计数据**即可，**速度非常快**

     - 另外， 我们可以不用redis，而是另建立一张数据统计表来处理上述问题吗？具体思路是每次用户完成提交后，后台更新**数据统计表**的信息，这样就不用查多个表进行大量计算，只需要查数据统计表就可以了 。这可能不是一个好的选择 ，因为我们需要保证**数据一致性**，试想：问卷发布者删除/修改一个题目/选项顺序，那么这张数据统计表就必须更新了，此时再来更新数据统计表就会出现麻烦了。



#### 一个问卷调查平台

#### 后端项目地址：https://github.com/yuzhanglong/EasyQuestionnaire-backend

#### 小程序端项目地址: https://github.com/yuzhanglong/EasyQuestionnaire-MiniProgram

#### API接口文档 : https://www.showdoc.cc/EasyQuestionnaire





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
