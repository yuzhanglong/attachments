import Vue from 'vue'
import VueRouter from 'vue-router'
import Store from '@/store/index'

const Home = () => import('@/views/home/home');
const Register = () => import('@/views/register/register');
const Login = () => import('@/views/login/login');
const Manage = () => import('@/views/manage/manage');
const Questionnaire = () => import('@/views/create/questionnaire');


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
  },
  //登录界面
  {
    path: '/login',
    component: Login,
  },
  //注册界面
  {
    path: '/register',
    component: Register,
  },
  //管理界面
  {
    path: '/manage',
    component: Manage,
    meta: {
      //需要权限
      requireAuth: true
    }
  },
  //问卷发布
  {
    path: '/questionnaire/:situation',
    component: Questionnaire,
  },
];

const router = new VueRouter({
  routes
});

//注册一个全局前置守卫
router.beforeEach((to, from, next) => {
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
