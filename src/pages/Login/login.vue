<!--后台登录界面-->
<template>
  <div class="loginForm">
    <p class="login-title">后台登录</p>
    <el-form label-width="100px" class="demo-ruleForm"  autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm">
      <el-form-item label="账号" prop="username">
        <el-input type="text" auto-complete="on" name="username" v-model="loginForm.username" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input :type="pwdType" name="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" auto-complete="on" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <!-- 点击进行登录提交 -->
        <el-checkbox v-model="checked" style="color:#a0a0a0;">一周内自动登录</el-checkbox>
        <span class="forget_pwd">忘记密码？</span>
        <el-button type="primary" :loading="loading" @click.native.prevent="handleLogin" class="el-button el-button--primary" style="width: 100%;">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {isvalidUsername} from '../../utils/validate'
  import {getCookie,setCookie,delCookie} from '../../utils/cookie'
  import {LOGIN_SESSION_TOKEN,LOGIN_SESSION_TOKEN_PWD} from '../../utils/global'

  export default {
    data(){
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('请输入正确的用户名'))
        } else {
          callback()
        }
      };
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码不能小于6位'))
        } else {
          callback()
        }
      };
      return {
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }]
        },
        pwdType: 'password',
        loading: false,
        showDialog: false,
        checked: true,
        pageName:''
      }
    },
    methods:{
      handleLogin(){
        let that = this;
        that.$refs.loginForm.validate(valid => {
          if(valid){
            that.loading = true;
            // TODO:后台需要提供相应的登录校验接口（传入参数：用户名和密码，返回JSON）
            axios.get('http://localhost:3143/api/account/login?uname=admin&upass=123',{
              loginInfo:that.loginForm
            }).then((response) => {
              if(response.data.code == 200){
                that.loading = false;
                //保存登录信息到cookie中
                var uname = that.loginForm.username;
                var upass = that.loginForm.password;
                setCookie(LOGIN_SESSION_TOKEN,uname,1);
                setCookie(LOGIN_SESSION_TOKEN_PWD,upass,1);
                if(that.$route.query.redirect){
                  that.$router.push(this.$route.query.redirect);
                }else{
                  that.$router.push('/bw/index');
                }
              }else{
                that.loading = false;
                that.$message({
                  message:response.data.message,
                  type:'error'
                });
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  body{
    background-color: #2d3a4b !important;
  }
  .loginForm{
    width: 24rem;
    margin: 0px auto;
    margin-top: 12%;
    padding: 2rem 2rem 2rem 1rem;
    color:#fff;
    border:4px solid #48576a;
    border-radius: 1rem;
    -webkit-border-radius: 1.2rem;
    -moz-box-shadow:8px 8px 20px #48576a;
    -webkit-box-shadow:8px 8px 20px #48576a;
    box-shadow:8px 8px 20px #48576a;
  }
  .login-title{
    text-align: center;
    margin-bottom: 1rem;
    color: #fff;
    font-size: 1.4rem;
  }
  #app{
    background-color: #2d3a4b !important;
  }
  .el-form-item__label{
    color:#fff !important;
  }
  .forget_pwd{
    cursor: pointer;
    color: #f19149;
    font-size: 0.75rem;
    margin-left: 5px;
  }
</style>
