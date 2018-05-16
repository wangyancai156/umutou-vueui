import Vue from 'vue'
import Router from 'vue-router'
import IndexPage from '@/pages/BW/index'
import inoutboundtable from '@/components/BW/Inoutbound/Inoutboundtable'
import login from '@/pages/login/login'
import admin from '@/pages/home/home'

import {getCookie,setCookie,delCookie} from "../utils/cookie";
import {fetch} from "../utils/http";
import {LOGIN_SESSION_TOKEN,LOGIN_SESSION_TOKEN_PWD} from "../utils/global";

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'IndexPage',
    component: IndexPage
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/home', //登录后的后台主界面，亦作模板页
    name: 'admin',
    component: admin,
    // meta:{
    //   requireAuth:true
    // },
    children:[
      {
        path: '/bw/inoutboundtable',
        name: 'inoutboundtable',
        component: inoutboundtable,
        meta:{
          requireAuth:true
        }
      },
      {
        path:'/bw/index',
        name:'index',
        component:IndexPage
      }
    ]
  }
];

// mode:'history' 此模式下，URL地址中会去掉#/，
const router = new Router({
  mode : 'history',
  routes
});

// 通过vue-router验证后台页面是否登录
router.beforeEach((to,from,next)=>{
  if(to.meta.requireAuth){
    var username = getCookie(LOGIN_SESSION_TOKEN);
    var password = getCookie(LOGIN_SESSION_TOKEN_PWD);
    fetch('/api/getLoginInfo?username='+username).then((response)=>{
      if(response.code === 200){
        if(response.data.password === password){
          next();
        }else{
          next({
            path:'/login',
            query:{redirect:to.fullPath}
          })
        }
      }else{
        next({
          path:'/login',
          query:{redirect:to.fullPath}
        })
      }
    })
  }else{
    next();
  }
});

export default router;
