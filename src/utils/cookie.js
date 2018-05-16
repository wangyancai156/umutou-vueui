
/**
 * cookie操作辅助方法
 * */

export function setCookie(c_name,value,expiredays){
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays); //设置cookie的过期时间

  window.document.cookie = c_name+'='+escape(value) +((expiredays == null?'':';expires=')+exdate.toGMTString());
}

export function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}

export function delCookie (name) {
  setCookie(name,'',-1);
}
