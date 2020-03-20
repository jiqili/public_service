<template>
  <div >
    <el-form class="info-container">
      <el-form-item label="院名">
        <el-input v-model="name" class="info-input" ref="nameInput" clearable="true" :readonly="!isEdit.editName"></el-input>
        <div v-show="ableEdit">
          <el-button type="primary" class="info-button" v-show="!isEdit.editName" @click="nameEdit">编辑</el-button>
          <el-button class="info-button" v-show="isEdit.editName" @click="cancelEditName">取消</el-button>
          <el-button type="success" class="info-button" v-show="isEdit.editName" @click="submitName">保存</el-button>
        </div>
      </el-form-item>
      <el-form-item label="指导老师">
        <el-input v-model="teacher" class="info-input" style="margin-left: 0" ref="teacherInput" clearable="true" readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="队长">
        <el-input v-model="leader" class="info-input" ref="leaderInput" clearable="true" readonly="true"></el-input>
      </el-form-item>
      <el-form-item style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);width: 635px;">
        <el-table :data="req" border>
          <el-table-column label="工时类型\困难等级" width="200" prop="first"></el-table-column>
          <el-table-column label="困难生" width="200" prop="second"></el-table-column>
          <el-table-column label="特困生"  prop="third"></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleEditRule" style="float: left;" v-show="ableEdit">编辑工时规定</el-button>
      </el-form-item>
      <el-form-item style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);width: 635px;">
        <el-table :data="depart" highlight-current-row >
          <el-table-column type="index" width="100px" label="#"></el-table-column>
          <el-table-column prop="name" width="200px" label="部门"></el-table-column>
          <el-table-column prop="sname"  label="部长"></el-table-column>
          <el-table-column label="操作" v-if="ableEdit" width="400">
            <template scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleAdd" type="primary" style="float: left;" v-show="ableEdit">新增</el-button>
      </el-form-item>
    </el-form>
    <!--新增部门-->
    <el-dialog title="新增部门" :visible.sync="addFormVisible" v-model="addFormVisible" visible_syn :close-on-click-modal="false" >
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
        <el-form-item  label="部门名字" prop="name">
          <el-input v-model="addForm.name" auto-complete="off" clearable="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancel">取消</el-button>
        <el-button type="primary" @click.native="addSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!--编辑工时规定-->
    <el-dialog title="编辑工时规定" :visible.sync="addFormVisible2" v-model="addFormVisible2" visible_syn :close-on-click-modal="false" >
      <el-form :model="addForm2" label-width="200px" :rules="addFormRules" ref="addForm2">
        <el-form-item  label="困难生校内应做工时数" prop="req01">
          <el-input v-model="addForm2.req01" auto-complete="off" clearable="true"></el-input>
        </el-form-item>
        <el-form-item  label="困难生校外应做工时数" prop="req11">
          <el-input v-model="addForm2.req11" auto-complete="off" clearable="true"></el-input>
        </el-form-item>
        <el-form-item  label="特困生校内应做工时数" prop="req02">
          <el-input v-model="addForm2.req02" auto-complete="off" clearable="true"></el-input>
        </el-form-item>
        <el-form-item  label="特困生校外应做工时数" prop="req12" >
          <el-input v-model="addForm2.req12" auto-complete="off" clearable="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancel2">取消</el-button>
        <el-button type="primary" @click.native="addSubmit2">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {findDepartmentById,findStudentById,findCollege,findUser,listColleges,listDepartments,collageUpdate,createDepartment,deleteDepartment} from "@/api/api";
  import global from '@/components/global';
  export default {
    data() {
      let checkId = (rule, value, callback) => {
        let tmp = false;
        for(let i=0;i<value.length && !tmp;i++)
          if(!(value[i]<='9' && value[i]>='0')){
            tmp = true;
          }
        if (tmp) {
          callback(new Error('时长必须是1~100的整数！'));
        }
        else {
          let value2 = parseInt(value);
          if(value2 > 100 || value2<=0){
            callback('时长必须是1~100的整数！');
          }
          else callback();
        }
      };
      return {
        id: '',
        title:'',
        userId: '',
        name: '',
        nameTmp: '',
        teacher: '',
        teacherTmp: '',
        leader: '',
        leaderTmp: '',
        depart: [],
        ableEdit: true,
        req: [{first: '校内应做工时', second: '', third: ''}, {first: '校外应做工时', second: '', third: ''}],
        isEdit: {
          editName: false,
          editTeacher: false,
          editStudent: false,
        },
        addForm: {
          name: '',
        },
        addForm2: {
          req01: '',
          req02: '',
          req11: '',
          req12: '',
        },
        addFormRules: {
          req01: [
            {required: true, message: '请输入工时数', trigger: 'blur'},
            {validator: checkId, trigger: 'blur'}
          ],
          req02: [
            {required: true, message: '请输入工时数', trigger: 'blur'},
            {validator: checkId, trigger: 'blur'}
          ],
          req11: [
            {required: true, message: '请输入工时数', trigger: 'blur'},
            {validator: checkId, trigger: 'blur'}
          ],
          req12: [
            {required: true, message: '请输入工时数', trigger: 'blur'},
            {validator: checkId, trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入部门名', trigger: 'blur'},
          ],
        },
        addFormVisible: false,
        addFormVisible2: false,
      }
    },
    methods: {
      handleEditRule() {
        this.addFormVisible2 = true;
        this.addForm2.req01 = this.req[0].second;
        this.addForm2.req02 = this.req[0].third;
        this.addForm2.req11 = this.req[1].second;
        this.addForm2.req12 = this.req[1].third;
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
        this.depart = res1.data.result.departments;
        this.req[0].second = res1.data.result.college.req01;
        this.req[0].third = res1.data.result.college.req02;
        this.req[1].second = res1.data.result.college.req11;
        this.req[1].third = res1.data.result.college.req12;
      },
      reLogin() {
        let para = {id: this.$store.getters.getUserId, password: this.$store.getters.getPassword};
        para.id = parseInt(para.id.toString());
        return this.axios.post(`http://localhost:8080/public_service/user/login`, para);
      },
      getCollage() {
        findCollege({id: this.id}).then((res) => {
          console.log(res.data);
          if (res.data.success === 0 && res.data.error.code === 3) {
            console.log('here');
            this.reLogin().then((res2) => {
              findCollege({id: this.id}).then((res1) => {
                if (res1.data.success === 0) this.$router.push('/error');
                else this.f(res1);
              })
            })
          } else if (res.data.success === 0) {
            this.$router.push('/error');
          } else this.f(res);
          listDepartments({cid: this.id}).then((res2) => {

          })
        })

      },
      nameEdit() {
        this.isEdit.editName = true;
        this.nameTmp = this.name;
        this.$refs.nameInput.focus();
      },
      cancelEditName() {
        this.isEdit.editName = false;
        this.name = this.nameTmp;
      },
      submitName() {
        if(this.name === '') this.$message.error('学院名不能为空！');
        else {
          collageUpdate({id: this.id, name: this.name}).then((res) => {
            if (res.data.success === 0) {
              if (res.data.error.code === 3) {
                this.g();
              } else if (res.data.error.code === 11) {
                this.$message.error('该学院名已存在！');
              } else {
                this.$router.push('/error');
              }
            } else {
              this.$message({
                type: 'success',
                message: '学院名更新成功'
              });
              this.isEdit.editName = false;
            }
          })
        }
      },
      teacherEdit() {
        this.isEdit.editTeacher = true;
        this.teacherTmp = this.teacher;
        this.$refs.teacherInput.focus();
        this.$message('请输入指导老师工号');
      },
      cancelEditTeacher() {
        this.isEdit.editTeacher = false;
        this.teacher = this.teacherTmp;
      },
      submitTeacher() {
        this.isEdit.editTeacher = false;
        findUser({number: this.teacher}).then((res) => {
          if (res.data.success === 0) {
            if (res.data.error.code === 3) {
              this.g();
            } else if (res.data.error.code === 6) {
              this.$message.error('该用户不存在！');
            } else this.$router.push('/error');
          } else {
            collageUpdate({id: this.id, tid: res.data.result.id}).then((res1) => {
              if (res1.data.success === 0) {
                if (res1.data.error.code === 10) {
                  this.$message.error('该用户已离校！');
                } else {
                  this.$router.push('/error');
                }
              } else {
                this.$message({
                  type: 'success',
                  message: '指导老师更新成功'
                });
                this.teacher = res.data.result.name;
              }
            })
          }
        })

      },
      studentEdit() {
        this.isEdit.editStudent = true;
        this.leaderTmp = this.leader;
        this.$refs.leaderInput.focus();
        this.$message('请输入队长学号');
      },
      cancelEditStudent() {
        this.isEdit.editStudent = false;
        this.leader = this.leaderTmp;
      },
      submitStudent() {
        this.isEdit.editStudent = false;
        findUser({number: this.leader}).then((res) => {
          if (res.data.success === 0) {
            if (res.data.error.code === 3) {
              this.g();
            } else if (res.data.error.code === 6) {
              this.$message.error('该用户不存在！');
            } else this.$router.push('/error');
          } else {
            collageUpdate({id: this.id, sid: res.data.result.id}).then((res1) => {
              if (res1.data.success === 0) {
                if (res1.data.error.code === 10) {
                  this.$message.error('该用户已离校！');
                } else {
                  this.$router.push('/error');
                }
              } else {
                this.$message({
                  type: 'success',
                  message: '队长更新成功'
                });
                this.leader = res.data.result.name;
              }
            })
          }
        })
      },
      handleEdit(index, row) {
        this.$router.push({path: '/departmentManage', query: {departId: Object.assign({}, row).id}});
      },
      handleDel(index, row) {
        this.$confirm('确认删除选中部门吗？', '提示', {
          type: 'warning'
        }).then(() => {
          deleteDepartment({id: row.id}).then((res) => {
            if (res.data.success === 0) {
              if (res.data.error.code === 3) {
                this.g();
              } else if (res.data.error.code === 13) {
                this.$message.error('该部门下还有学生');
              } else this.$router.push('/error');
            } else {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getCollage();
            }
          })
        })
      },
      handleAdd() {
        this.addFormVisible = true;
      },
      addSubmit() {
        this.$refs['addForm'].validate((valid) => {
          if (valid) {
            console.log(this.addForm.name);
            createDepartment({name: this.addForm.name, cid: this.id}).then((res) => {
              if (res.data.success === 0) {
                if (res.data.error.code === 3) this.g();
                else if (res.data.error.code === 16) this.$message.error('该学院下已有该部门!');
                else this.$router.push('/error');
              } else {
                this.$message({
                  type: 'success',
                  message: '新增部门成功！'
                });
                this.getCollage();
                this.addFormVisible = false;
              }
            })
          }
        })
      },
      cancel() {
        this.addFormVisible = false;
        this.$refs['addForm'].resetFields();
      },
      addSubmit2() {
        this.$refs['addForm2'].validate((valid) => {
          if (valid){
            this.addFormVisible2 = false;
            collageUpdate({
              id: this.id,
              req01: this.addForm2.req01,
              req02: this.addForm2.req02,
              req11: this.addForm2.req11,
              req12: this.addForm2.req12
            }).then((res) => {
              if (res.data.success === 0) {
                if (res.data.error.code === 3) {
                  this.g();
                } else {
                  this.$router.push('/error');
                }
              } else {
                this.$message({
                  type: 'success',
                  message: '工时规定更新成功'
                });
                this.getCollage();
              }
            })}
        })
      },
      cancel2() {
        this.addFormVisible2 = false;
        this.$refs['addForm2'].resetFields();
      },
      f1(res) {
        this.id = res.data.result.c2[0];
        this.getCollage();
      },
      f3(res){
        this.id = res.data.result.c1[0];
        this.ableEdit = false;
        this.getCollage();
      },
      f2(res){
        this.id = res.data.result.cid;
        this.ableEdit = false;
        this.getCollage();
      },
      init(){
        this.userId = this.$store.getters.getUserId;
        this.userId = parseInt(this.userId.toString());
        this.title = this.$store.getters.getTitle;
        if (this.title === '工时管理员') {
          findCollege().then((res) => {
            console.log(res.data);
            if (res.data.success === 0) {
              if (res.data.error.code === 3) {
                this.reLogin().then(() => {
                  findCollege().then((res1) => {
                    if (res1.data.success === 0) this.$router.push('/error');
                    else this.f1(res1);
                  })
                })
              } else this.$router.push('/error');
            } else this.f1(res);
          });
        }
        else if (this.title === '指导老师') {
          findCollege().then((res) => {
            console.log(res.data);
            if (res.data.success === 0) {
              if (res.data.error.code === 3) {
                this.reLogin().then(() => {
                  findCollege().then((res1) => {
                    if (res1.data.success === 0) this.$router.push('/error');
                    else this.f3(res1);
                  })
                })
              } else this.$router.push('/error');
            }
            else this.f3(res);
          });
        }
        else if(this.title === '队长'){
          findStudentById({id:this.userId}).then((res) => {
            if(res.data.success === 0) {
              if(res.data.error.code === 3){
                this.reLogin().then(() => {
                  findStudentById({id:this.userId}).then((res1) => {
                    this.f2(res1);
                  })
                })
              }
              else this.$router.push('/error');
            }
            else {
              this.f2(res);
            }
          })
        }
      }
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
    margin-left: 28px
  }
  .info-button {
    float: right;
  }
</style>
