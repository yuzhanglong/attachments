import Vue from 'vue'
import VueRouter from 'vue-router'


const Home = () => import('@/views/home/home');
const Register = () => import('@/views/register/register');
const Login = () => import('@/views/login/login');


Vue.use(VueRouter);

const routes = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
];

const router = new VueRouter({
  routes
});

export default router
