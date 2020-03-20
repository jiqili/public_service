<!--用户自己改密码，输入旧密码-->
<!--编辑取消按钮-->
<!--全部编辑结束后返回-->

<template>
  <div class="info-container" >
    <el-form  class="info-page" v-loading="loading">
      <el-form-item style="text-align: left">
        <h1>个人信息</h1>
        <hr>
      </el-form-item>
      <el-form-item :label=sysUserName>
        <el-input v-model="number" class="info-input" :readonly="!isEdit.numEdit" ref="numInfo" clearable></el-input>
        <div v-show="ableEdit.number">
          <el-button type="primary" class="info-button" v-show="!isEdit.numEdit" @click="editNum">编辑</el-button>
          <el-button  class="info-button" v-show="isEdit.numEdit" @click="cancelSubmitNum">取消</el-button>
          <el-button type="success" class="info-button" v-show="isEdit.numEdit" @click="submitNum">保存</el-button>
        </div>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="name" class="info-input" :readonly="!isEdit.nameEdit" ref="nameInfo" clearable></el-input>
        <div v-show="ableEdit.name">
          <el-button type="primary" class="info-button" v-show="!isEdit.nameEdit" @click="editName">编辑</el-button>
          <el-button  class="info-button" v-show="isEdit.nameEdit" @click="cancelSubmitName">取消</el-button>
          <el-button type="success" class="info-button" v-show="isEdit.nameEdit" @click="submitName">保存</el-button>
        </div>

      </el-form-item>
      <el-form-item label="状态" v-show="isVisible.statusVisible">
        <el-input v-model="status" class="info-input" v-show="!isEdit.statusEdit" :readonly="!isEdit.statusEdit"></el-input>
        <div class="info-input" v-show="isEdit.statusEdit">
          <el-radio v-model="status" label="离校" >离校</el-radio>
          <el-radio v-model="status" label="在校" >在校</el-radio>
        </div>
        <div v-show="ableEdit.status">
          <el-button type="primary" class="info-button" v-show="!isEdit.statusEdit" @click="editStatus">编辑</el-button>
          <el-button class="info-button" v-show="isEdit.statusEdit" @click="cancelSubmitStatus">取消</el-button>
          <el-button type="success" class="info-button" v-show="isEdit.statusEdit" @click="submitStatus">保存</el-button>
        </div>
      </el-form-item>
      <el-form-item label="注册时间" v-show="isVisible.timeVisible">
        <div class="block ">
          <el-date-picker
            v-model="datetime"
            type="datetime"
            size="large"
            class="info-input"
            style="margin-left: 0"
            :readonly="!isEdit.datetimeEdit">
          </el-date-picker>
        </div>
        <div v-show="ableEdit.datetime">
          <el-button type="primary" class="info-button" v-show="!isEdit.datetimeEdit" @click="editDatetime">编辑</el-button>
          <el-button class="info-button" v-show="isEdit.datetimeEdit" @click="cancelSubmitDatetime">取消</el-button>
          <el-button type="success" class="info-button" v-show="isEdit.datetimeEdit" @click="submitDatetime">保存</el-button>
        </div>
      </el-form-item>
      <el-form-item label="权限" v-show="isVisible.permissionVisible">
        <el-input v-model="title" class="info-input" v-show="!isEdit.titleEdit" :readonly="true"></el-input>
        <el-select v-model="title" v-show="isEdit.titleEdit" ref="titleSelect" class="info-input">
          <el-option
            v-for="item in titleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学院" v-show="title === '工时管理员' || title === '指导老师'">
        <el-input v-model="cname" class="info-input" :readonly="true" v-show="!isEdit.cnameEdit"></el-input>
        <!--<div v-show="ableEdit.college">-->
          <!--<el-select v-model="selectCid" v-show="isEdit.cnameEdit" class="info-input">-->
            <!--<el-option-->
              <!--v-for="item in collegeOptions"-->
              <!--:key="item.id"-->
              <!--:label="item.name"-->
              <!--:value="item.id">-->
            <!--</el-option>-->
          <!--</el-select>-->
          <!--&lt;!&ndash;<div>&ndash;&gt;-->
            <!--&lt;!&ndash;<el-button type="primary" class="info-button" v-show="!isEdit.cnameEdit" @click="editCname">编辑</el-button>&ndash;&gt;-->
            <!--&lt;!&ndash;<el-button class="info-button" v-show="isEdit.cnameEdit" @click="cancelSubmitCname">取消</el-button>&ndash;&gt;-->
            <!--&lt;!&ndash;<el-button type="success" class="info-button" v-show="isEdit.cnameEdit" @click="submitCname">保存</el-button>&ndash;&gt;-->
          <!--&lt;!&ndash;</div>&ndash;&gt;-->
        <!--</div>-->
      </el-form-item>
      <el-form-item label="学院部门" v-show="isVisible.departVisible">
        <el-input v-model="selectedOptions2" class="info-input" v-show="!isEdit.selectEdit" style="margin-left: 0" :readonly="!isEdit.selectEdit"></el-input>
        <div class="block">
          <el-cascader
            :options="options"
            v-model="selectedOptions"
            class="info-input"
            style="margin-left: 0"
            v-show="isEdit.selectEdit"
            @change="handleChange">
          </el-cascader>
        </div>
        <div v-show="ableEdit.depart">
          <el-button type="primary" class="info-button" v-show="!isEdit.selectEdit" @click="editSelect">编辑</el-button>
          <el-button class="info-button" v-show="isEdit.selectEdit" @click="cancelSubmitSelect">取消</el-button>
          <el-button type="success" class="info-button" v-show="isEdit.selectEdit" @click="submitSelect">保存</el-button>
        </div>
      </el-form-item>
      <el-form-item label="班级" v-show="isVisible.telVisible">
        <el-input v-model="sclass" class="info-input" :readonly="!isEdit.sclassEdit"></el-input>
        <div v-show="ableEdit.sclass">
          <el-button type="primary" class="info-button" v-show="!isEdit.sclassEdit" @click="editSclass">编辑</el-button>
          <el-button class="info-button" v-show="isEdit.sclassEdit" @click="cancelSubmitSclass">取消</el-button>
          <el-button type="success" class="info-button" v-show="isEdit.sclassEdit" @click="submitSclass">保存</el-button>
        </div>
      </el-form-item>
      <el-form-item label="电话" v-show="isVisible.telVisible">
        <el-input v-model="tel" class="info-input" :readonly="!isEdit.telEdit"></el-input>
        <div v-show="ableEdit.tel">
          <el-button type="primary" class="info-button" v-show="!isEdit.telEdit" @click="editTel">编辑</el-button>
          <el-button class="info-button" v-show="isEdit.telEdit" @click="cancelSubmitTel">取消</el-button>
          <el-button type="success" class="info-button" v-show="isEdit.telEdit" @click="submitTel">保存</el-button>
        </div>
      </el-form-item>
      <el-form-item label="等级" v-show="isVisible.levelVisible">
      <el-input v-model="levelName" class="info-input" v-show="!isEdit.levelEdit" :readonly="!isEdit.levelEdit"></el-input>
        <div class="info-input" v-show="isEdit.levelEdit">
          <el-radio v-model="level" label="0" >非困难</el-radio>
          <el-radio v-model="level" label="1" >困难</el-radio>
          <el-radio v-model="level" label="2" >特困</el-radio>
        </div>
        <div v-show="ableEdit.level">
          <el-button type="primary" class="info-button" v-show="!isEdit.levelEdit" @click="editLevel">编辑</el-button>
          <el-button class="info-button" v-show="isEdit.levelEdit" @click="cancelSubmitLevel">取消</el-button>
          <el-button type="success" class="info-button" v-show="isEdit.levelEdit" @click="submitLevel">保存</el-button>
        </div>
      </el-form-item>
      <el-form-item >
        <el-button type="text" @click="isEdit.passEdit = true" style="float: left">修改密码</el-button>
      </el-form-item>
    </el-form>

    <!--修改密码-->
    <el-dialog title = "设置新密码" :visible.sync="isEdit.passEdit">
      <el-form  ref="editPass" :model="editPass" status-icon :rules="ruleForm2">
        <el-form-item label="新密码" prop="pass">
          <el-input v-model="editPass.pass" type="password" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="editPass.checkPass" type="password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm('editPass')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  import {getOptions,findUser,findStudentById,userUpdate,studentUpdate,findDepartmentById,listColleges,listDepartments,findCollege} from "@/api/api";
  import global from '@/components/global';
  export default {
      name: "userInfo",
      data() {
        let validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'));
          } else {
            if (this.editPass.checkPass !== '') {
              this.$refs.editPass.validateField('checkPass');
            }
            callback();
          }
        };
        let validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.editPass.pass) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
          return {
            editPass: {
              pass: '',
              checkPass: '',
            },
            ruleForm2: {
              pass: [
                { validator: validatePass, trigger: 'blur' }
              ],
              checkPass: [
                { validator: validatePass2, trigger: 'blur' }
              ],
            },
            ableEdit:{
              datetime:false,
              title:false,
              college:false,
              depart:false,
              level:false,
              number:false,
              tel:false,
              sclass:false,
              name:false,
              status:false,
            },
            id: parseInt(this.$route.query.userId.toString()),
            sysUserName:'学号',
            loading:true,
            number:'',
            numberTmp:'',
            title:'',
            cname:'',
            selectCid:'',
            collegeOptions:[],
            titleTmp:'',
            name: '',
            nameTmp:'',
            status:'',
            statusTmp:'',
            datetime:'',
            datetimeTmp:'',
            tel:'',
            telTmp:'',
            sclass:'',
            sclassTmp:'',
            level:'',
            levelName:'',
            isEdit:{
              numEdit:false,
              nameEdit:false,
              datetimeEdit:false,
              titleEdit:false,
              selectEdit:false,
              levelEdit:false,
              telEdit:false,
              statusEdit:false,
              sclassEdit:false,
              passEdit:false,
              cnameEdit:false,
              statusEdit:false,
            },
            isVisible:{
              permissionVisible:false,
              timeVisible:false,
              departVisible:false,
              collegeVisible:false,
              telVisible:false,
              levelVisible:false,
              statusVisible:false,
            },
            isTeacher:false,
            options: [],
            titleOptions:[{value:'管理员',label:'管理员'},{value:'工时管理员',label:'工时管理员'},{value:'普通用户',label:'普通用户'}],
            selectedOptions:[],
            selectedOptionsTmp:[],
            selectedOptions2:'',
          }
      },
    methods: {
      g(){
        this.$router.go(0);
        this.$message({
          message: '重新登录成功！',
          type: 'success'
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
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
      submitForm() {
        this.$refs['editPass'].validate((valid) => {
          if(valid){
            this.isEdit.passEdit = false;
            let para ={id:this.id,password:this.editPass.pass};
            para.password = this.$md5(para.password);
            userUpdate(para).then(async (res) => {
              if (res.data.success === 0) {
                let tmp = res.data.error.code;
                if (tmp === 3) {
                  this.$router.go(0);
                  this.$message({
                    message: '重新登录成功！',
                    type: 'success'
                  });
                }
              }
              else {
                this.$message({
                  message: '提交成功！',
                  type: 'success'
                })
              }
            })
          }
        })
      },
      editNum() {
          this.isEdit.numEdit = true;
          this.$refs.numInfo.focus();
          this.numberTmp = this.number;
      },
      submitNum() {
          this.isEdit.numEdit = false;
          let para ={id:this.id,number:this.number};
          userUpdate(para).then(async (res) => {
            console.log(res.data);
            if (res.data.success === 0) {
              let tmp = res.data.error.code;
              if (tmp === 20) {
                this.$message.error('用户学号/工号包含非法字符！');
                this.number = this.numberTmp;
              }
              else if (tmp === 7) {
                this.$message.error('该用户学号/工号已存在！');
                this.number = this.numberTmp;
              }
              else if (tmp === 3) {
                this.g();
              }
            } else {
              this.$message({
                message: '提交成功！',
                type: 'success'
              })
            }
          })
      },
      cancelSubmitNum(){
        this.isEdit.numEdit = false;
        this.number = this.numberTmp;
      },
      editCname(){
        this.isEdit.cnameEdit = true;
      },
      submitCname(){
        this.isEdit.cnameEdit = false;
        userUpdate({id:this.id,cid:this.selectCid}).then((res) => {
          if(res.data.success === 0) {
            if(res.data.error.code === 3) this.g();
            else if(res.data.error.code === 21) {
              this.$alert('该学院已存在工时管理员，是否覆盖？', '警告', {
                confirmButtonText: '确定',
                callback: action => {
                  userUpdate({id:this.id,cid:this.selectCid,override:1}).then((res1) => {
                    if(res1.data.success ) this.$router.push('/error');
                    else {
                      this.$message({
                        type:'success',
                        message:'提交成功'
                      });
                      for(let i in this.collegeOptions){
                        if(this.collegeOptions[i].id === this.selectCid) {
                          this.cname = this.collegeOptions[i].name;
                          break;
                        }
                      }
                    }
                  })
                }
              });
            }
            else  this.$router.push('/error');
          }
          else {
            this.$message({
              type:'success',
              message:'提交成功'
            });
            for(let i in this.collegeOptions){
              if(this.collegeOptions[i].id === this.selectCid) {
                this.cname = this.collegeOptions[i].name;
                break;
              }
            }
          }
        })
      },
      cancelSubmitCname(){
        this.isEdit.cnameEdit = false;
      },
      editTitle() {
        this.isEdit.titleEdit = true;
        this.$refs.titleSelect.focus();
        this.titleTmp = this.title;
      },
      submitTitle() {
        this.isEdit.titleEdit = false;
        let tmp = -1;
        if(this.title === '工时管理员') tmp = global.recordManager;
        else if(this.title === '普通用户') tmp = 0;
        let para ={id:this.id,permission:tmp};
        userUpdate(para).then(async (res) => {
          if (res.data.success === 0) {
            let tmp = res.data.error.code;
            if (tmp === 3) {
              this.g();
            }
          }
          else {
            this.$message({
              message: '提交成功！',
              type: 'success'
            })
          }
        })
      },
      cancelSubmitTitle(){
        this.isEdit.titleEdit = false;
        this.title = this.titleTmp;
      },
      editStatus(){
        this.isEdit.statusEdit = true;
        this.statusTmp = this.status;
      },
      submitStatus(){
        this.isEdit.statusEdit = false;
        let para ={id:this.id,status:this.status};
        if(para.status === '离校') para.status = 0;
        else para.status = 1;
        userUpdate(para).then(async (res) => {
          if (res.data.success === 0) {
            let tmp = res.data.error.code;
            if (tmp === 3) {
              this.g();
            }
          }
          else {
            this.$message({
              message: '提交成功！',
              type: 'success'
            });
          }
        })
      },
      cancelSubmitStatus(){
        this.isEdit.statusEdit = false;
        this.status = this.statusTmp;
      },
      editName() {
        this.isEdit.nameEdit = true;
        this.$refs.nameInfo.focus();
        this.nameTmp = this.name;
      },
      submitName() {
        this.isEdit.nameEdit = false;
        let para ={id:this.id,name:this.name};
        userUpdate(para).then(async (res) => {
          if (res.data.success === 0) {
            let tmp = res.data.error.code;
            if (tmp === 4) this.$message.error('当前用户没有更改他人用户名权限！');
            else if (tmp === 3) {
              this.g();
            }
          } else {
            this.$message({
              message: '提交成功！',
              type: 'success'
            })
          }
        })
      },
      cancelSubmitName(){
        this.isEdit.nameEdit = false;
        this.name = this.nameTmp;
      },
      editDatetime() {
        this.isEdit.datetimeEdit = true;
        this.datetimeTmp = this.datetime;
      },
      cancelSubmitDatetime(){
        this.isEdit.datetimeEdit = false;
        this.datetime = this.datetimeTmp;
      },
      submitDatetime() {
        this.isEdit.datetimeEdit = false;
        let para ={id:this.id,datetime:this.datetime};
        console.log(para);
        let tmp = new Date(para.datetime);
        console.log(tmp);
        para.datetime = tmp.getTime();
        console.log(para);
        studentUpdate(para).then(async (res) => {
          console.log(res.data);
          if (res.data.success === 0) {
            console.log(res.data);
            let tmp = res.data.error.code;
            if (tmp === 3) {
              this.g();
            }
            else this.$router.push('/error');
          } else {
            this.$message({
              message: '提交成功！',
              type: 'success'
            })
          }
        })
      },
      editSelect() {
        this.isEdit.selectEdit = true;
        this.selectedOptionsTmp = this.selectedOptions;
      },
      cancelSubmitSelect(){
        this.isEdit.selectEdit = false;
        this.selectedOptions = this.selectedOptionsTmp;
      },
      submitSelect() {
        this.isEdit.selectEdit = false;
        let para = {did:this.selectedOptions[1],id:this.id};
        if(this.$store.getters.getTitle === '工时管理员') para.did = this.selectedOptions[0];
        studentUpdate(para).then((res) => {
          if(res.data.success === 0){
            if(res.data.error.code === 3) this.g();
            else this.$router.push('/error');
          }
          else {
            this.$message({
              type:'success',
              message:'提交成功'
            });
            findDepartmentById({id:para.did}).then((res1) => {
              if(res1.data.success === 0) this.error();
              else {
                this.selectedOptions2 = res1.data.result.cname + ' / ' + res1.data.result.name;
              }
            })
          }
        })
      },
      editSclass(){
        this.isEdit.sclassEdit = true;
        this.sclassTmp = this.sclass;
      },
      cancelSubmitSclass(){
        this.isEdit.sclassEdit = false;
        this.sclass = this.sclassTmp;
      },
      submitSclass(){
        this.isEdit.sclassEdit = false;
        studentUpdate({id:this.id,sclass:this.sclass}).then((res) => {
          if(res.data.success === 0){
            if(res.data.error.code === 3) this.g();
            else this.$router.push('/error');
          }
          else {
            this.$message({
              type:'success',
              message:'提交成功'
            })
          }
        })
      },
      editTel() {
        this.isEdit.telEdit = true;
        this.telTmp = this.tel;
      },
      cancelSubmitTel(){
        this.isEdit.telEdit = false;
        this.tel = this.telTmp;
      },
      submitTel() {
        this.isEdit.telEdit = false;
        let para ={id:this.id,phone:this.tel};
        studentUpdate(para).then(async (res) => {
          if (res.data.success === 0) {
            let tmp = res.data.error.code;
            if (tmp === 3) {
             this.g();
            } else this.$router.push('/error');
          } else {
            this.$message({
              message: '提交成功！',
              type: 'success'
            })
          }
        })
      },
      editLevel() {
        this.isEdit.levelEdit = true;
      },
      cancelSubmitLevel(){
        this.isEdit.levelEdit = false;
      },
      submitLevel() {
        this.isEdit.levelEdit = false;
        let para ={id:this.id,level:parseInt(this.level)};
        studentUpdate(para).then(async (res) => {
          if (res.data.success === 0) {
            let tmp = res.data.error.code;
            if (tmp === 3) {
              this.g();
            } else this.$router.push('/error');
          } else {
            this.$message({
              message: '提交成功！',
              type: 'success'
            });
            if(this.level === '0') this.levelName = '非困难';
            else if(this.level === '1') this.levelName = '困难';
            else this.levelName = '特困';
          }
        })
      },
      error(){
        this.$router.push('/error');
      },
      f(res6) {
        let tmp = res6.data.result;
        this.name = tmp.name;
        this.number = tmp.number;
        this.status = tmp.status;
        if(this.status) this.status = '在校';
        else this.status = '离校';
        if(this.$store.getters.getTitle === '管理员'){
          this.ableEdit.depart = true;
          this.ableEdit.college = true;
          this.ableEdit.datetime = true;
          this.ableEdit.name = true;
          this.ableEdit.sclass = true;
          this.ableEdit.tel = true;
          this.ableEdit.level = true;
          this.ableEdit.title = true;
          this.ableEdit.number = true;
          this.ableEdit.status = true;
          this.isVisible.statusVisible = true;
          this.isVisible.permissionVisible = true;
          if(this.id.toString() === this.$store.getters.getUserId.toString()) {
            this.ableEdit.title = false;
            this.ableEdit.status = false;
          }
          getOptions().then((res) => {
            console.log(res.data);
            if(res.data.success === 0) this.error();
            else {
              this.options = res.data.result;
            }
          });
          listColleges().then((res1) => {
            console.log(res1.data);
            if(res1.data.success === 0) this.$router.push('/error');
            else {
              this.collegeOptions = res1.data.result;
              console.log(this.collegeOptions);
              console.log(this.id);
              for(let i in this.collegeOptions){
                if(this.id === this.collegeOptions[i].uid){
                  if(this.cname === '') this.cname = this.collegeOptions[i].name;
                  else {
                    this.cname += '/';
                    this.cname += this.collegeOptions[i].name;
                  }
                  this.selectCid = this.collegeOptions[i].id;
                }
                if(this.id === this.collegeOptions[i].tid){
                  if(this.cname === '') this.cname = this.collegeOptions[i].name;
                  else {
                    this.cname += '/';
                    this.cname += this.collegeOptions[i].name;
                  }
                  this.selectCid = this.collegeOptions[i].id;
                }
              }
            }
          });
        }
        else if(this.$store.getters.getTitle === '工时管理员'){
          console.log('here');
          this.ableEdit.depart = true;
          this.ableEdit.datetime = true;
          this.ableEdit.level = true;
          this.ableEdit.name = true;
          this.ableEdit.tel = true;
          this.ableEdit.sclass = true;
          if(tmp.permission !== global.recordManager) {
            this.ableEdit.number = true;
            this.ableEdit.status = true;
          }
          findCollege().then((res) => {
            console.log(res.data);
            if(res.data.success === 0) this.error();
            else {
              if(res.data.result.c2.length !== 0){
                findCollege({id:res.data.result.c2[0]}).then((res1) => {
                  console.log(res1.data);
                  if(res1.data.success) this.cname = res1.data.result.college.name;
                  else this.error();
                });
                getOptions({cid:res.data.result.c2[0]}).then((res1) => {
                  if(res1.data.success === 0) this.error();
                  else {
                    this.options = res1.data.result;
                  }
                });
              }
            }
          })
        }
        if(tmp.permission === -1) {
          this.title = '管理员';
        }
        else if(tmp.permission === global.recordManager) {
          this.title = '工时管理员';
        }
        else {
          if(this.$store.getters.getTitle === '管理员'){
            findStudentById({id:this.id}).then((res2) => {
              if(res2.data.success === 0 && res2.data.error.code === 14){
                this.title = '指导老师';
              }
              else if(res2.data.success === 1){
                this.tel = res2.data.result.phone;
                this.level = res2.data.result.level;
                this.sclass = res2.data.result.sclass;
                if(this.level === 0) this.levelName = '非困难';
                else if(this.level === 1) this.levelName = '困难';
                else  this.levelName = '特困';
                this.level = this.level.toString();
                this.datetime = this.formatDate(res2.data.result.datetime);
                this.isVisible.levelVisible = true;
                this.isVisible.telVisible = true;
                this.isVisible.timeVisible = true;
                this.selectedOptions = [1,1];
                this.selectedOptions[0] = res2.data.result.cid;
                this.selectedOptions[1] = res2.data.result.did;
                this.selectedOptions2 = res2.data.result.cname;
                this.selectedOptions2 += ' / ';
                this.selectedOptions2 += res2.data.result.dname;
                this.isVisible.departVisible = true;
                findCollege({id:res2.data.result.cid}).then((res3) => {
                  console.log(res3.data);
                  if(res3.data.success) {
                    if(this.id === res3.data.result.college.sid) this.title = '队长';
                    else {
                      findDepartmentById({id:res2.data.result.did}).then((res4) => {
                        console.log(res4.data);
                        if(res4.data.success){
                          if(this.id === res4.data.result.sid) this.title = '部长';
                          else this.title = '同学';
                        }
                        else this.error();
                      })
                    }
                  }
                  else this.error();
                })
              }
              else {
                this.$router.push('/error');
              }
            })
          }
          else if(this.$store.getters.getTitle === '工时管理员'){
            findStudentById({id:this.id}).then((res2) => {
              if(res2.data.success === 0 && res2.data.error.code === 14){
                this.title = '未激活账户';
              }
              else if(res2.data.success === 1){
                this.tel = res2.data.result.phone;
                this.level = res2.data.result.level;
                this.sclass = res2.data.result.sclass;
                if(this.level === 0) this.levelName = '非困难';
                else if(this.level === 1) this.levelName = '困难';
                else  this.levelName = '特困';
                this.level = this.level.toString();
                this.datetime = this.formatDate(res2.data.result.datetime);
                this.isVisible.levelVisible = true;
                this.isVisible.telVisible = true;
                this.isVisible.timeVisible = true;
                this.selectedOptions = [1,1];
                this.selectedOptions[0] = res2.data.result.did;
                this.selectedOptions[1] = res2.data.result.did;
                this.selectedOptions2 = res2.data.result.cname;
                this.selectedOptions2 += ' / ';
                this.selectedOptions2 += res2.data.result.dname;
                this.isVisible.departVisible = true;
              }
              else {
                this.$router.push('/error');
              }
            })
          }
          else if(this.$store.getters.getTitle !== '指导老师'){
            findStudentById({id:this.id}).then((res2) => {
              if(res2.data.success === 0 && res2.data.error.code === 14){
                this.title = '未激活账户';
              }
              else if(res2.data.success === 1){
                this.tel = res2.data.result.phone;
                this.level = res2.data.result.level;
                this.sclass = res2.data.result.sclass;
                if(this.level === 0) this.levelName = '非困难';
                else if(this.level === 1) this.levelName = '困难';
                else  this.levelName = '特困';
                this.level = this.level.toString();
                this.datetime = this.formatDate(res2.data.result.datetime);
                this.isVisible.levelVisible = true;
                this.isVisible.telVisible = true;
                this.isVisible.timeVisible = true;
                this.selectedOptions = [1,1];
                this.selectedOptions[0] = res2.data.result.did;
                this.selectedOptions[1] = res2.data.result.did;
                this.selectedOptions2 = res2.data.result.cname;
                this.selectedOptions2 += ' / ';
                this.selectedOptions2 += res2.data.result.dname;
                this.isVisible.departVisible = true;
              }
              else {
                this.$router.push('/error');
              }
            })
          }
          else {
            findUser({id:this.id}).then((res2) => {
              if(res2.data.success){
                this.cname = res2.data.result.cname2;
                this.title = this.$store.getters.getTitle;
              }
            })
          }
        }
      },
      reLogin() {
        let para = {id:this.$store.getters.getUserId,password:this.$store.getters.getPassword};
        para.id = parseInt(para.id.toString());
        return this.axios.post(`http://localhost:8080/public_service/user/login`,para);
      }
    },
      mounted() {
        this.id = parseInt(this.id.toString());
        findUser({id:this.id}).then((res) =>{
          console.log('here1');
          console.log(res.data);
          if(res.data.success === 0 && res.data.error.code === 3){
            this.reLogin().then(() => { findUser({id: this.id}).then(res1 => {
              if (res1.data.success === 0) {
                this.$router.push('/error');
              } else {
                this.f(res1);
              }
            });
            });
          }
          else {
            console.log('here3');
            this.f(res);
          }
        });
        this.loading = false;
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
    margin-left: 28px
  }
  .info-button {
    float: right;
  }
</style>
