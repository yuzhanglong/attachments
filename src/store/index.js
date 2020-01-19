import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    questionnaireSendingData: {},
    token: window.localStorage.getItem('token'),
    user: window.localStorage.getItem('user'),
  },
  mutations: {
    /*
    *问卷题目类方法
    */
    //1.问卷初始化
    questionnaireDataInit(state) {
      state.questionnaireSendingData = {
        //发送者
        sender: state.user,
        //基本信息 包括标题和副标题
        basicInfo: {
          title: "",
          subtitle: ""
        },
        problems: []
      }
    },
    // 2.动态更新基本信息  传入基本信息对象
    renewQuestionnaireBasicInfo(state, basicInfo) {
      state.questionnaireSendingData.basicInfo = basicInfo
    },
    // 3.追加一道题目  传入问题对象
    appendProblemToQuestionnaire(state, problemObject) {
      state.questionnaireSendingData.problems.push(problemObject)
    },
    // 4.追加题目的某个选项（如果有的话）
    appendOption(state, optionObject) {
      state.questionnaireSendingData.problems[optionObject.index].common = optionObject.data
    },


    /*
    *权限验证类方法
    */
    setToken(state, token) {
      //这里将把需要的变量写入localStorage
      state.token = token;
      window.localStorage.setItem('token', token);
    },
    setUser(state, user) {
      state.user = user;
      window.localStorage.setItem('user', user);
    },
    removeTokenAndUser(state) {
      //退出登录 删除token
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user");
      state.token = null;
      state.user = null;
      state.isDisable = true
    }
  },
  actions: {},
  modules: {}
})
