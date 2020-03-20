<template>
  <div class="login-container">
    <img src="../assets/logo.png" style="width:250px; height: 250px;">
    <el-form :model="user" :rules="rules1" ref="loginForm" class="login-page"label-position="left" label-width="0px">
      <el-form-item prop="number">
        <el-input v-model="user.number" auto-complete="off">
          <template slot="prepend">账号</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="user.password" auto-complete="off">
          <template slot="prepend">密码</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login()" style="width: 70%">登录</el-button>
      </el-form-item>
      <div style="text-align: left;">
        <el-checkbox v-model="checked">记住密码</el-checkbox>
      </div>
    </el-form>
  </div>
</template>

<script>
  import {findUserById} from "@/api/api";
  import global from '@/components/global';
  export default {
    name: "Login",
    data: function () {
      // let checkId = (rule, value, callback) => {
      //   if (value % 1 !== 0) {
      //     callback(new Error('账号为数字'));
      //   } else callback();
      // };
      return {
        checked:false,
        user: {
          id: '',
          number: '',
          password: ''
        },
        rules1: {
          number: [
            {required: true, message: '请输入账号（学号、工号）', trigger: 'blur'},
            // {min: 1, max: 10, message: '账号为10位以内非负整数', trigger: 'blur'},
            // {validator: checkId, trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      login() {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            this.axios.post('http://localhost:8080/public_service/user/login', {
              number: this.user.number,
              password: this.$md5(this.user.password)
            }).then((res) => {
              if (res.data.success) {
                console.log(res.data);
                this.user.id = res.data.result.id;
                this.$notify({
                  title: '欢迎',
                  message: res.data.result.name + ' 登录成功！',
                  type: 'success'
                });
                this.$store.dispatch('setUserId', parseInt(this.user.id));
                this.$store.dispatch('setPassword', this.$md5(this.user.password));
                this.$router.push({
                  path: '/'
                });
              } else {
                console.log(res.data.error);
                this.$notify.error({
                  title: '错误',
                  message: '登录失败！'
                });
              }
            }, (err) => {
              console.log(err);
            });
          }
        });
      },
      resetForm() {
        this.$refs['loginForm'].resetFields();
      }
    }
  }
</script>

<style scoped>
  .login-container {
    width: 100%;
    height: 100%;
  }
  .login-page {
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    margin: 15px auto;
    width: 350px;
    padding: 35px 35px 15px;
    background: #fff;
    border: 1px solid #eaeaea;
    -webkit-box-shadow: 0 0 25px #cac6c6;
    -moz-box-shadow: 0 0 25px #cac6c6;
    box-shadow: 0 0 25px #cac6c6;
  }
</style>
