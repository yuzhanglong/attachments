import Vue from 'vue'
import VueRouter from 'vue-router'
import Store from '@/store/index'

const Home = () => import('@/views/home/home');
const Register = () => import('@/views/register/register');
const Login = () => import('@/views/login/login');
const Manage = () => import('@/views/manage/manage');
const Questionnaire = () => import('@/views/create/questionnaire');
const Spread = () => import('@/views/spread/spread');
const Complete = () => import('@/views/complete/complete');
const Analysis = () => import('@/views/analysis/analysis');
const Success = () => import('@/views/success/success');

Vue.use(VueRouter);


const routes = [
  //欢迎页面
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
    meta: {
      title: '问卷调查平台'
    }
  },
  //登录界面
  {
    path: '/login',
    component: Login,
    meta: {
      title: '问卷调查平台-登录'
    }
  },
  //注册界面
  {
    path: '/register',
    component: Register,
    meta: {
      title: '问卷调查平台-注册'
    }
  },
  //管理界面
  {
    path: '/manage',
    component: Manage,
    meta: {
      //需要权限
      requireAuth: true,
      title: '问卷调查平台-管理'
    }
  },
  //问卷编辑
  {
    path: '/questionnaire/:situation',
    component: Questionnaire,
    meta: {
      requireAuth: true,
      title: '问卷设计'
    }
  },
  //问卷发布
  {
    path: '/spread/:flag',
    component: Spread,
    meta: {
      title: '问卷调查平台-发布'
    }
  },
  //问卷填写
  {
    path: '/complete/:flag',
    component: Complete,
  },
  //问卷数据分析
  {
    path: '/analysis/:flag',
    component: Analysis,
    meta: {
      //需要权限
      requireAuth: true,
      title: '问卷调查平台-数据分析'
    }
  },
  //提交成功页面
  {
    path: '/success',
    component: Success,
    meta: {
      title: '提交成功啦'
    }
  },
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

//注册一个全局前置守卫
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 需要权限的路由跳转
  Store.state.token = localStorage.getItem('token');
  if (to.meta.requireAuth) { //判断接下来的页面是否需要权限
    if (Store.state.token !== null) {//token不为空
      next();   //跳转到对应页面
    } else {      //没有token,跳转到登录界面
      next({
        path: '/login',
      });
    }
  } else {
    next();
  }
});


export default router
