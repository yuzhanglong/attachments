import Vue from 'vue'
import VueRouter from 'vue-router'
import {checkToken} from "../network/user";
import {Authentication} from "../models/response_model";

const Home = () => import('../views/home/home');
const Register = () => import('../views/register/register');
const Login = () => import('../views/login/login');
const Manage = () => import('../views/manage/manage');
const Questionnaire = () => import('../views/create/questionnaire');
const Spread = () => import('../views/spread/spread');
const Complete = () => import('../views/complete/complete');
const Analysis = () => import('../views/analysis/analysis');
const Success = () => import('../views/success/success');

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
      title: '问卷调查平台-登录',
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
      requireAuth: true,
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

// 全局前置守卫
router.beforeEach((to, from, next) => {

  // 项目标题
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // 需要权限的路由跳转
  if (to.meta.requireAuth) {
    checkToken().then(() => {
      next();
    }).catch(() => {
      // 转向登录页要求用户登录 并带上强制跳转的 query
      next({path: '/login?type=force'});
      Authentication.removeToken();
    });
  } else {
    next();
  }

});

export default router


