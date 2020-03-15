<template>
  <div id="login">
    <el-header></el-header>
    <el-header></el-header>
    <div class="box">
      <h1>欢迎</h1>
      <label><input type="text" placeholder="请输入用户名" v-model="loginData.userName"></label>
      <label><input type="password" placeholder="请输入密码" v-model="loginData.userPassword"></label>
      <a class="submit" @click="userLogin">Login</a>
    </div>
  </div>
</template>

<script>
  import {userLogin} from "../../network/user";
  import {Authentication, ErrorResponse} from "../../models/response_model";

  export default {
    name: "login",
    data() {
      return {
        loginData: {
          userName: "",
          userPassword: "",
        }
      }
    },
    created() {
      this.checkLogin();
    },
    methods: {
      checkLogin() {
        if (window.localStorage.getItem('token') != null) {
          this.$router.replace('/manage');
        }else{
          this.checkCondition();
        }
      },

      checkCondition() {
        if (this.$route.query.type) {
          this.$messageBox.showErrorMessage(this, "请登录");
        }
      },

      userLogin() {
        if (this.loginData.userName === '' || this.loginData.userPassword === '') {
          this.$messageBox.showErrorMessage(this, "请完成所有必填项！");
        } else if (this.loginData.userName.length > 10) {
          this.$messageBox.showErrorMessage(this, "用户名格式错误");
        } else {
          userLogin(this.loginData.userName, this.loginData.userPassword)
            .then(res => {
              let r = new Authentication(res);
              r.saveToken();
              this.$messageBox.showSuccessMessage(this, r.information);
              this.$router.replace('/manage')
            })
            .catch(res => {
              let r = new ErrorResponse(res);
              this.$messageBox.showErrorMessage(this, r.information);
            })
        }
      }
    }
  }
</script>

<style scoped>
  #login {
    height: 100%;
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(7, 4, 5, 0.9);
  }

  .box {
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
  }

  .box h1 {
    color: white;
    text-transform: uppercase;
    font-weight: 500;
  }

  .box input[type='text'],
  .box input[type='password'] {
    background: none;
    display: block;
    margin: 20px auto;
    text-align: center;
    border: 2px solid #3498db;
    padding: 14px 10px;
    width: 280px;
    outline: none;
    color: white;
    border-radius: 24px;
    transition: 0.25s;
  }

  .box input[type='text']:focus {
    width: 300px;
    border-color: #2bccc1;
  }

  .box input[type='password']:focus {
    width: 300px;
    border-color: #cc5f5b;
  }

  .submit {
    background: none;
    margin: 20px auto;
    display: inline-block;
    text-align: center;
    border: 2px solid #3498db;
    padding: 10px 40px;
    outline: none;
    color: white;
    border-radius: 24px;
    transition: 0.25s;
    cursor: pointer;
    text-decoration: none;
    font-size: 12px;
  }
</style>