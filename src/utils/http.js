import axios from 'axios';
import {getCookie} from "./cookie";
import {LOGIN_SESSION_TOKEN} from "./global";

//axios配置
axios.defaults.timeout = 5000;

if(process.env.NODE_ENV == "production"){
  axios.defaults.baseUrl = "http://www.umutou.com/";
}else{
  axios.defaults.baseUrl = "http://localhost:3143";
}

// http request 拦截器
axios.interceptors.request.use(
  config => {
    const token = getCookie(LOGIN_SESSION_TOKEN); //获取cookie
    config.data = JSON.stringify(config.data);
    config.headers = {
      'Content-Type':'application/x-www-form-urlencoded' //设置跨域头部
    };
    if(token){
      config.params = {'token':token};
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);


// http response 拦截器
axios.interceptors.response.use(
  response => {
    if(response.data.errCode == 2){
      router.push({
        path:'/admin',
        query:{redirect:router.currentRoute.fullPath}
      });
    }
    return response;
  },
  error => {
    return Promise.reject(error.response.data);
  });

export default axios;

/**
 * get请求方法
 * */
export function fetch(url, params = {}) {
  return new Promise((resolve,reject)=>{
    axios.get(url,{
      params:params
    }).then(response => {
      resolve(response.data);
    }).catch(err => {
      reject(err);
    })
  })
}
