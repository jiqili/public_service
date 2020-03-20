<template>
  <div >
    <el-form class="info-container">
      <el-form-item label="部门">
        <el-input v-model="name" class="info-input" :readonly="!isEdit.editName" ref="nameInput" clearable></el-input>
        <div v-show="ableEdit">
          <el-button type="primary" class="info-button" v-show="!isEdit.editName" @click="nameEdit">编辑</el-button>
          <el-button class="info-button" v-show="isEdit.editName" @click="cancelEditName">取消</el-button>
          <el-button type="success" class="info-button" v-show="isEdit.editName" @click="submitName">保存</el-button>
        </div>
      </el-form-item>
      <el-form-item label="所属学院">
        <el-input v-model="collage" class="info-input" style="margin-left: 0" ref="collageInput" clearable readonly="!isEdit.editCollage"></el-input>
        <!--<div v-show="ableEdit">-->
          <!--<el-button type="primary" class="info-button" v-show="!isEdit.editCollage" @click="collageEdit">编辑</el-button>-->
          <!--<el-button class="info-button" v-show="isEdit.editCollage" @click="cancelEditCollage">取消</el-button>-->
          <!--<el-button type="success" class="info-button" v-show="isEdit.editCollage" @click="submitCollage">保存</el-button>-->
        <!--</div>-->
      </el-form-item>
      <el-form-item label="部长">
        <el-input v-model="leader" class="info-input" readonly="true"></el-input>
      </el-form-item>
      <el-form-item style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);">
        <el-table :data="students" highlight-current-row >
          <el-table-column type="index" width="100px" label="#"></el-table-column>
          <el-table-column prop="number" width="200px" label="学号"></el-table-column>
          <el-table-column prop="name" width="200px" label="姓名"></el-table-column>
          <el-table-column prop="sclass" width="200px" label="班级"></el-table-column>
          <el-table-column prop="phone"  label="电话" width="200"></el-table-column>
          <el-table-column prop="datetime"  label="入学时间" width="200" :formatter="formatdate"></el-table-column>
          <el-table-column prop="level"  label="困难等级"></el-table-column>
          <el-table-column label="操作" v-if="ableEdit" width="400">
            <template scope="scope" >
              <el-button v-if="scope.row.id !== sid" type="primary" @click="leaderEdit(scope.row)" size="small">设为部长</el-button>
              <el-button v-if="scope.row.id === sid" type="warning" @click="leaderEdit(scope.row)" size="small">撤销部长</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {findDepartmentById,listColleges,listStudents,findCollege,findUser,listDepartments,updateDepartment,findStudentById} from "@/api/api";
  import global from '@/components/global';
  export default {
    data() {
      return {
        id:'',
        sid:'',
        name:'',
        nameTmp:'',
        leader:'',
        leaderTmp:'',
        collage:'',
        collageTmp:'',
        ableEdit:true,
        students:[],
        isEdit:{
          editName:false,
          editCollage:false,
          editStudent:false,
        },
        options:[],
      }
    },
    methods: {
      formatDate(time) {
        let date = new Date(time);
        let year = date.getFullYear();
        let month = date.getMonth()+ 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
      },
      formatdate: function (row, column) {
        return  this.formatDate(row.datetime);
      },
      f(res){
        if(res.data.result.permission !== 0){
          this.id = parseInt(this.$route.query.departId.toString());
          console.log(this.id);
          findDepartmentById({id:this.id}).then((res1) => {
            console.log('here2');
            console.log(res1.data);
            if(res1.data.success === 0){
              this.$router.push('/error');
            }
            else {
              this.name = res1.data.result.name;
              this.leader = res1.data.result.sname;
              this.sid = res1.data.result.sid;
              findCollege().then((res2) => {
                console.log(res2.data);
                if(res2.data.success === 0) {
                  this.$router.push('/error');
                }
                else {
                  findCollege({id:res2.data.result.c2[0]}).then((res3) => {
                    console.log(res3.data);
                    if(res3.data.success === 0) this.$router.push('/error');
                    else {
                      this.collage = res3.data.result.college.name;
                    }
                  })
                }
              });
              listStudents({did:this.id,page:1,num:1000,tbegin:12345678900,tend:12345678900}).then((res2) => {
                console.log('here3');
                console.log(res2.data);
                if(res2.data.success === 0){
                  this.$router.push('/error');
                }
                else {
                  this.students = res2.data.result.list;
                  for(let i in this.students){
                    if(this.students[i].level === 0) this.students[i].level = '非困难';
                    else if(this.students[i].level === 1) this.students[i].level = '困难';
                    else this.students[i].level = '特困';
                  }
                }
              })
            }
          })
        }
        else {
          this.ableEdit = false;
          findStudentById({id:parseInt(this.$store.getters.getUserId.toString())}).then((res1) => {
            console.log('here4');
            console.log(res1.data);
            if(res1.data.success === 0) this.$router.push('/error');
            else {
              this.id = res1.data.result.did;
              this.collage = res1.data.result.cname;
              findDepartmentById({id:this.id}).then((res4) => {
                console.log('here2');
                console.log(res4.data);
                if(res4.data.success === 0){
                  this.$router.push('/error');
                }
                else {
                  this.name = res4.data.result.name;
                  this.leader = res4.data.result.sname;
                  listStudents({did:this.id,page:1,num:1000,tbegin:12345678900,tend:12345678900}).then((res2) => {
                    console.log('here3');
                    console.log(res2.data);
                    if(res2.data.success === 0){
                      this.$router.push('/error');
                    }
                    else {
                      this.students = res2.data.result.list;
                      for(let i in this.students){
                        if(this.students[i].level === 0) this.students[i].level = '非困难';
                        else if(this.students[i].level === 1) this.students[i].level = '困难';
                        else this.students[i].level = '特困';
                      }
                    }
                  })
                }
              })
            }
          })
        }
      },
      reLogin() {
        console.log('reLogin');
        let para = {id:this.$store.getters.getUserId,password:this.$store.getters.getPassword};
        para.id = parseInt(para.id.toString());
        return this.axios.post(`http://localhost:8080/public_service/user/login`,para);
      },
      init(){
        findUser({id:parseInt(this.$store.getters.getUserId.toString())}).then((res) => {
          if(res.data.success === 0) {
            if(res.data.error.code === 3) {
              this.reLogin().then(() => {
                  findUser({id:parseInt(this.$store.getters.getUserId.toString())}).then((res1) => {
                    if(res1.data.success === 0) {
                      this.$router.push('/error');
                    }
                    else this.f(res1);
                  })
              })
            }
            else this.$router.push('/error');
          }
          else {
            this.f(res);
          }
        })
      },
      g() {
        this.$router.go(0);
        // this.init();
        this.$message({
          message: '重新登录成功！',
          type: 'success'
        });
      },
      nameEdit(){
        this.isEdit.editName = true;
        this.$refs.nameInput.focus();
        this.nameTmp = this.name;
      },
      cancelEditName(){
        this.isEdit.editName = false;
        this.name = this.nameTmp;
      },
      submitName(){
        if(this.name === '') this.$message.error('部门名不能为空！');
        else {
          this.isEdit.editName = false;
          updateDepartment({id:this.id,name:this.name}).then((res) => {
            if(res.data.success === 0){
              if(res.data.error.code === 3) this.g();
              else if(res.data.error.code === 16) {
                this.$message.error('该学院下已存在该部门名！');
                this.name = this.nameTmp;
              }
              else this.$router.push('/error');
            }
            else {
              this.$message({
                type:'success',
                message:'成功更改部门名'
              })
            }
          })
        }
      },
      // collageEdit(){
      //   this.isEdit.editCollage = true;
      //   this.$refs.collageInput.focus();
      //   this.collageTmp = this.collage;
      //   this.$message('请输入学院号');
      // },
      // cancelEditCollage(){
      //   this.isEdit.editCollage = false;
      //   this.collage = this.collageTmp;
      // },
      // submitCollage(){
      //   this.isEdit.editCollage = false;
      //
      // },
      leaderEdit(row){
        if(row.id !== this.sid){
          this.$alert('确定将 '+row.name+' 设为部长吗？', '新设部长', {
            confirmButtonText: '确定',
            callback: action => {
              if(action === 'confirm'){
                updateDepartment({id:this.id,sid:row.id}).then((res) => {
                  if(res.data.success === 0){
                    this.$router.push('/error');
                  }
                  else {
                    this.$message({
                      type:'success',
                      message:'新设部长成功'
                    });
                    this.init();
                  }
                });
              }
            }
          });
        }
        else {
          this.$alert('确定将 '+row.name+' 撤销部长吗？', '撤销部长', {
            confirmButtonText: '确定',
            callback: action => {
              if(action === 'confirm'){
                updateDepartment({id:this.id,sid:null}).then((res) => {
                  if(res.data.success === 0){
                    this.$router.push('/error');
                  }
                  else {
                    this.$message({
                      type:'success',
                      message:'撤销部长成功'
                    });
                    this.init();
                  }
                });
              }
            }
          });
        }
      },
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>
  .info-container {
    margin-top: 40px;
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
    margin-left: 28px;
  }
  .info-button {
    float: right;
  }
</style>
