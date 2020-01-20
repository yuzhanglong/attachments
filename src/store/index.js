import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: window.localStorage.getItem('token'),
    user: window.localStorage.getItem('user'),
  },
  mutations: {
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
    }
  },
  actions: {},
  modules: {}
})
