<template>
  <div class="login-body">
    <!-- 警告框 -->
    <div
      class="alert"
      :class="{
        'info-box success': loginSuccess,
        'info-box error': loginError,
      }"
      v-if="showAlert"
    >
      {{ loginMessage }}
    </div>
    <!-- 登录页面 -->
    <div class="login-wrap">
      <div class="title">客户管理系统</div>
      <div>
        <form class="login-form" @submit.prevent="handleLogin">
          <div class="item">
            <input
              type="text"
              class="form-control"
              name="mobile"
              placeholder="请输入手机号"
              v-model="mobile"
            />
          </div>
          <div class="item">
            <input
              type="text"
              class="form-control"
              name="pwd"
              placeholder="默认密码246810"
              v-model="pwd"
            />
          </div>
          <div class="item">
            <button type="submit" class="btn btn-primary">登 录</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>  
  
<script>
export default {
  name: "Login",
  data() {
    return {
      mobile: "13888888888", // 初始手机号
      pwd: "246810", // 初始密码
      loginMessage: "",
      loginSuccess: false,
      loginError: false,
      showAlert: false,
    };
  },
  methods: {
    handleLogin() {
      this.showAlert = true; // 显示警告框
      if (this.mobile === "13888888888" && this.pwd === "246810") {
        // 可选：显示登录成功消息
        this.loginSuccess = true;
        this.loginError = false;
        this.loginMessage = "登录成功，正在跳转...";
        setTimeout(() => {
          this.showAlert = false; // 隐藏警告框
          this.$router.push("/home"); // 使用Vue Router进行页面跳转
        }, 1500);
      } else {
        // 显示登录失败消息
        this.loginSuccess = false;
        this.loginError = true;
        this.loginMessage = "手机号或密码错误";
        setTimeout(() => {
          this.showAlert = false; // 隐藏警告框
        }, 2000);
      }
      console.log("登录手机号:", this.mobile, "密码:", this.pwd);
    },
  },
};
</script> 

<style scoped>
.login-body {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0; /* 添加margin: 0来消除默认的margin */
}

.alert {
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  text-align: center;
}
.success {
  background-color: #4caf50; /* 绿色 */
  color: white;
}
.error {
  background-color: #f44336; /* 红色 */
  color: white;
}

.alert {
  width: 400px;
  position: fixed;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
}

.login-wrap {
  width: 400px;
  padding: 20px;
  background-color: #fff;
}

.login-wrap .title {
  font-size: 28px;
  text-align: center;
  color: #fc6627;
}

.login-wrap .login-form {
  margin-top: 20px;
}

input::-webkit-input-placeholder {
  color: #dcdfe6 !important;
}

.login-form .btn {
  width: 100%;
  background-color: #66b1ff;
  border: 1px solid #66b1ff;
}

.login-form .item:nth-child(n + 1) {
  margin-top: 20px;
}
</style>