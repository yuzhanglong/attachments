import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueClipboard from 'vue-clipboard2'
import messageBox from "./utils/messageBox";
import '@/assets/css/normalize.css'
import '@/assets/css/basicProblem.css'
import globalData from '@/assets/js/common'


Vue.config.productionTip = false;
Vue.prototype.globalData = globalData.development;
Vue.use(ElementUI);
Vue.use(messageBox);
Vue.use(VueClipboard);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
