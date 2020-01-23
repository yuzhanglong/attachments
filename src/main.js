import Vue from 'vue'
import './cube-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import echarts from './utils/echarts';
import 'element-ui/lib/theme-chalk/index.css';
import VueClipboard from 'vue-clipboard2'
import messageBox from "@/utils/messageBox";
import '@/assets/css/normalize.css'
import '@/assets/css/basicProblem.css'


Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(echarts);
Vue.use(messageBox);
Vue.use(VueClipboard);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
