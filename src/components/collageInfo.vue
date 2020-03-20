<template>
  <div class="info-container">
    <el-form class="info-page">
      <el-form-item style="text-align: left">
        <h1>学院信息</h1>
        <hr>
      </el-form-item>
      <el-form-item label="院名">
        <el-input v-model="name" class="info-input" :readonly="!isEdit.editName" clearable="true" ref="nameInput"></el-input>
        <div v-show="ableEdit">
          <el-button type="primary" class="info-button" v-show="!isEdit.editName" @click="nameEdit">编辑</el-button>
          <el-button class="info-button" v-show="isEdit.editName" @click="cancelEditName">取消</el-button>
          <el-button type="success" class="info-button" v-show="isEdit.editName" @click="submitName">保存</el-button>
        </div>
      </el-form-item>
      <el-form-item label="指导老师" >
        <el-input v-model="teacher" class="info-input" style="margin-left: 14px" :readonly="!isEdit.editTeacher" clearable="true" ref="teacherInput"></el-input>
        <!--<div v-show="ableEdit">-->
          <!--<el-button type="primary" class="info-button" v-show="!isEdit.editTeacher" @click="teacherEdit">编辑</el-button>-->
          <!--<el-button class="info-button" v-show="isEdit.editTeacher" @click="cancelEditTeacher">取消</el-button>-->
          <!--<el-button type="success" class="info-button" v-show="isEdit.editTeacher" @click="submitTeacher">保存</el-button>-->
        <!--</div>-->
      </el-form-item>
      <el-form-item label="工时管理员">
        <el-input v-model="recorder" class="info-input" style="margin-left: 0" :readonly="true" clearable="true" ref="leaderInput"></el-input>
      </el-form-item>
      <el-form-item label="队长">
        <el-input v-model="leader" class="info-input" :readonly="!isEdit.editStudent" clearable="true" ref="leaderInput"></el-input>
        <!--<div v-show="ableEdit">-->
          <!--<el-button type="primary" class="info-button" v-show="!isEdit.editStudent" @click="studentEdit">编辑</el-button>-->
          <!--<el-button class="info-button" v-show="isEdit.editStudent" @click="cancelEditStudent">取消</el-button>-->
          <!--<el-button type="success" class="info-button" v-show="isEdit.editStudent" @click="submitStudent">保存</el-button>-->
        <!--</div>-->
      </el-form-item>
      <el-form-item style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)">
        <el-table :data="depart" highlight-current-row>
          <el-table-column type="index" width="150px" label="#"></el-table-column>
          <el-table-column prop="name" width="250px" label="部门"></el-table-column>
          <el-table-column prop="sname" width="250px" label="部长"></el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {findCollege,collageUpdate,findUser} from "@/api/api";
  import global from '@/components/global';
  export default {
        data() {
          return {
            id:parseInt(this.$route.query.collageId.toString()),
            name:'',
            nameTmp:'',
            teacher:'',
            teacherTmp:'',
            recorder:'',
            leader:'',
            leaderTmp:'',
            depart:[],
            ableEdit:true,
            isEdit:{
              editName:false,
              editTeacher:false,
              editStudent:false,
            }
          }
        },
        methods: {
          cancelEditName(){
            this.isEdit.editName = false;
            this.name = this.nameTmp;
          },
          async g() {
            this.$router.go(0);
            this.$message({
              message: '重新登录成功！',
              type: 'success'
            });
          },
          f(res1) {
            this.name = res1.data.result.college.name;
            this.teacher = res1.data.result.college.tname;
            this.leader = res1.data.result.college.sname;
            this.recorder = res1.data.result.college.uname;
            this.depart = res1.data.result.departments;
          },
          reLogin() {
            let para = {id:this.$store.getters.getUserId,password:this.$store.getters.getPassword};
            para.id = parseInt(para.id.toString());
            return this.axios.post(`http://localhost:8080/public_service/user/login`,para);
          },
          getCollage(){
            console.log(this.id);
            findCollege({id:this.id}).then((res) => {
              console.log(res.data);
              if(res.data.success === 0 && res.data.error.code === 3){
                console.log('here');
                this.reLogin().then((res2) => {
                  findCollege({id:this.id}).then((res1) => {
                    console.log(res1);
                    if(res1.data.success === 0) this.$router.push('/error');
                    else this.f(res1);
                  })
                })
              }
              else if(res.data.success === 0) {
                this.$router.push('/error');
              }
              else this.f(res);
            })

          },
          nameEdit(){
            this.isEdit.editName = true;
            this.nameTmp = this.name;
            this.$refs['nameInput'].focus();
          },
          submitName(){
            this.isEdit.editName = false;
            let para = {id:this.id,name:this.name};
            collageUpdate(para).then((res) => {
              if(res.data.success === 0){
                if(res.data.error.code === 3) {
                  this.g();
                }
                else if(res.data.error.code === 11){
                  this.$message.error('该学院名已存在！');
                  this.name = this.nameTmp;
                }
              }
              else {
                this.$message({
                  message:'学院名更改成功！',
                  type:'success'
                })
              }
            })
          },
          cancelEditTeacher(){
            this.isEdit.editTeacher = false;
            this.teacher = this.teacherTmp;
          },
          teacherEdit(){
            this.isEdit.editTeacher = true;
            this.teacherTmp = this.teacher;
            this.$message('请输入老师工号');
            this.teacher = '';
            this.$refs['teacherInput'].focus();
          },
          submitTeacher(){
            this.isEdit.editTeacher = false;
            findUser({number:this.teacher}).then((res) => {
              console.log(res.data);
              if(res.data.success === 0) {
                if(res.data.error.code === 3) {this.g()}
                else if(res.data.error.code === 6){
                  this.$message.error('该用户不存在！');
                }
                else this.$router.push('/error');
              }
              else {
                collageUpdate({id:this.id,tid:res.data.result.id}).then((res1) => {
                  console.log(res1.data);
                  if(res1.data.success === 0){
                    if(res1.data.error.code === 10){
                      this.$message.error('该用户已离校！');
                    }
                    else this.$router.push('/error');
                  }
                  else {
                    this.$message({
                      type:'success',
                      message:'成功更改指导老师！'
                    });
                    this.teacher = res.data.result.name;
                  }
                })
              }
            })
          },
          cancelEditStudent(){
            this.isEdit.editStudent = false;
            this.leader = this.leaderTmp;
          },
          studentEdit(){
            this.isEdit.editStudent = true;
            this.leaderTmp = this.leader;
            this.$message('请输入队长学号');
            this.leader = '';
            this.$refs['leaderInput'].focus();
          },
          submitStudent(){
            this.isEdit.editStudent = false;
            findUser({number:this.leader}).then((res) => {
              if(res.data.success === 0) {
                if(res.data.error.code === 3) {this.g()}
                else if(res.data.error.code === 6){
                  this.$message.error('该用户不存在！');
                }
                else this.$router.push('/error');
              }
              else {
                collageUpdate({id:this.id,sid:res.data.result.id}).then((res1) => {
                  console.log(res1.data);
                  if(res1.data.success === 0){
                    if(res1.data.error.code === 10){
                      this.$message.error('该用户已离校！');
                    }
                    else if(res1.data.error.code === 13){
                      this.$message.error('不能用外院用户作为队长！');
                    }
                    else this.$router.push('/error');
                  }
                  else {
                    this.$message({
                      type:'success',
                      message:'成功更改队长！'
                    });
                    this.leader = res.data.result.name;
                  }
                })
              }
            })
          },
        },
      mounted() {
          this.getCollage();
      }
    }
</script>

<style scoped>
  .info-container {
    width: 100%;
    height: 100%;
  }
  .info-page {
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    margin: 15px auto;
    width: 40%;
    padding: 35px 35px 15px;
    background: #fff;
    border: 1px solid #eaeaea;
    -webkit-box-shadow: 0 0 25px #cac6c6;
    -moz-box-shadow: 0 0 25px #cac6c6;
    box-shadow: 0 0 25px #cac6c6;
  }
  .info-input {
    width: 50%;
    float: left;
    margin-left: 42px
  }
  .info-button {
    float: right;
  }
</style>
