<template>
  <div class="login_container">
    <div class="login_box">
      <div class="header_box">
        <img
          src="../assets/logo.png"
          alt=""
        >
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login_form"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="el-input__icon el-icon-user"/>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
          >
            <i
              slot="prefix"
              class="el-input__icon el-icon-lock"
            />
          </el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button
            type="primary"
            @click="login"
          >
            登录
          </el-button>
          <el-button
            type="info"
            @click="resetLoginForm"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 验证规则
      loginRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
  height: 100%;
  background-color: #2b4b6b;
  .login_box{
    width: 500px;
    height: 350px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .header_box{
      height: 120px;
      width: 120px;
      border: 1px solid #ccc;
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 0 5px #ccc;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -180%);
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #ccc;
      }
    }
  }
}
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns{
  display: flex;
  justify-content: center;
}
</style>
