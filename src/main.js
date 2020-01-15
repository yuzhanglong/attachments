import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import echarts from './utils/echarts';


Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(echarts);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
