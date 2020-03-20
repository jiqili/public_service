<template>
  <div>
    <el-col :span="24" class="toolbar" style="text-align: left;padding-top: 10px;background-color: rgb(242, 242, 242)">
      <el-form :inline="true">
        <el-form-item>
          <el-select v-model="selectedDepart" placeholder="选择部门">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleQuery" >查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleAdd" type="primary" v-show="ableEdit">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-col>
      <el-table :data="students" highlight-current-row @selection-change="selsChange">
        <el-table-column type="selection"  width="40" v-if="title === '工时管理员'">
        </el-table-column>
        <el-table-column type="index" width="40">
        </el-table-column>
        <el-table-column prop="number" label="学号" width="100" sortable>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="100" >
        </el-table-column>
        <el-table-column prop="sclass" label="班级" width="120" >
        </el-table-column>
        <el-table-column prop="dname" label="部门" width="100" >
        </el-table-column>
        <el-table-column prop="phone" label="电话" width="150" >
        </el-table-column>
        <el-table-column prop="level" label="困难等级" width="100" >
        </el-table-column>
        <el-table-column prop="datetime" label="入学时间" width="200" >
        </el-table-column>
        <el-table-column label="操作" v-if="ableEdit" width="600">
          <template scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
            <el-button size="small" @click="leaderEdit(scope.row)" v-show="scope.row.id !== sid">设为队长</el-button>
            <el-button size="small" type="warning" @click="leaderEdit(scope.row)" v-show="scope.row.id === sid">撤销队长</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col>
      <el-button type="danger"  style="float: left" @click="batchRemove" :disabled="this.sels.length===0" v-show="ableEdit">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;"></el-pagination>
    </el-col>

    <el-dialog title="新增" :visible.sync="addFormVisible" v-model="addFormVisible" visible_syn :close-on-click-modal="false" >
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
        <el-form-item  label="学号" prop="number">
          <el-input v-model="addForm.number" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="sclass">
          <el-input v-model="addForm.sclass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addForm.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="did" style="text-align: left">
          <el-select v-model="addForm.did" placeholder="选择部门" style="width: 100%;">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="困难等级" prop="level" style="text-align: left">
          <el-select v-model="addForm.level" placeholder="困难等级" style="width: 100%;">
            <el-option
              v-for="item in levelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入学时间" prop="datetime" style="text-align: left">
          <div class="block" >
            <el-date-picker
              style="width: 100%;"
              v-model="addForm.datetime"
              type="datetime"
              placeholder="选择入学时间">
            </el-date-picker>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancel">取消</el-button>
        <el-button type="primary" @click.native="addSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {listStudents,listDepartments,createStudent,userUpdate,findStudentById,findCollege,collageUpdate} from "@/api/api";
  import global from '@/components/global';
  export default {
    data() {
      return {
        cid: '',
        sid: '',
        title: '',
        selectedDepart: '',
        ableEdit: true,
        sels: [],
        userId: '',
        page: 1,
        total: 0,
        options: [],
        levelOptions: [{value: '0', label: '非困难'}, {value: '1', label: '困难'}, {value: '2', label: '特困'},],
        students: [],
        addFormVisible: false,
        addForm: {
          name: '',
          number: '',
          sclass: '',
          did: '',
          datetime: '',
          level: '',
          phone: '',
        },
        addFormRules: {
          number: [
            { required: true, message: '请输入工号', trigger: 'blur' },
          ],
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
          ],
          sclass: [
            { required: true, message: '请输入班级', trigger: 'blur' },
          ],
          phone: [
            { required: true, message: '请输入电话', trigger: 'blur' },
          ],
          did: [
            { required: true, message: '请选择部门', trigger: 'blur' },
          ],
          level: [
            { required: true, message: '请选择困难等级', trigger: 'blur' },
          ],
          datetime: [
            { required: true, message: '请选择入学时间', trigger: 'blur' },
          ],
        },
      }
    },
    methods: {
      g() {
        this.$router.go(0);
        this.$message({
          message: '重新登录成功！',
          type: 'success'
        });
      },
      formatDate(time) {
        let date = new Date(time);
        let year = date.getFullYear();
        let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
      },
      f(res) {
        this.options = res.data.result;
        let para = {cid: this.cid, tbegin: 123456789100, tend: 123456789100, page: this.page, num: 10};
        if (this.selectedDepart !== '') para.did = this.selectedDepart;
        console.log(para);
        listStudents(para).then((res1) => {
          if (res1.data.success === 0) {
            this.$router.push('/error');
          } else {
            this.students = res1.data.result.list;
            for (let i in this.students) {
              this.students[i].datetime = this.formatDate(this.students[i].datetime);
              if (this.students[i].level === 0) this.students[i].level = '非困难';
              else if (this.students[i].level === 1) this.students[i].level = '困难';
              else if (this.students[i].level === 2) this.students[i].level = '特困';
            }
            this.total = res1.data.result.total;
          }
        })
      },
      reLogin() {
        let para = {id: this.$store.getters.getUserId, password: this.$store.getters.getPassword};
        para.id = parseInt(para.id.toString());
        return this.axios.post(`http://localhost:8080/public_service/user/login`, para);
      },
      init() {
        listDepartments({cid: this.cid}).then((res) => {
          console.log('here1');
          console.log(res.data);
          if (res.data.success === 0) {
            if (res.data.error.code === 3) {
              this.reLogin().then(() => {
                listDepartments({cid: this.cid}).then((res1) => {
                  console.log('here2');
                  console.log(res1.data);
                  if (res1.data.success === 0) this.$router.push('/error');
                  else this.f(res1);
                })
              })
            } else this.$router.push('/error');
          } else this.f(res);
        })
      },
      handleCurrentChange(val) {
        this.page = val;
        this.init();
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      batchRemove: function () {
        let ids = this.sels.map(item => item.id);
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          for (let i = 0; i < ids.length; i++) {
            let para = {id: ids[i], status: 0};
            userUpdate(para).then((res) => {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.init();
            });
          }
        })
      },
      handleQuery() {
        this.init();
        this.page = 1;
      },
      handleEdit(index, row) {
        this.$router.push({path: '/userInfo', query: {userId: Object.assign({}, row).id}});
        console.log('error');
      },
      leaderEdit(row){
        if(row.id !== this.sid){
          collageUpdate({id:this.cid,sid:row.id}).then((res) => {
            console.log(res.data);
            if(res.data.success){
              this.$message({
                type:'success',
                message:'成功设置队长'
              });
              this.rootInit();
            }
            else {
              if(res.data.error.code === 3) this.g();
              else this.$message.error('设置队长失败！');
            }
          })
        }
        else {
          collageUpdate({id:this.cid,sid:null}).then((res) => {
            console.log(res.data);
            if(res.data.success){
              this.$message({
                type:'success',
                message:'成功撤销队长'
              });
              this.rootInit();
            }
            else {
              if(res.data.error.code === 3) this.g();
              else this.$message.error('撤销队长失败！');
            }
          })
        }
      },
      handleDel(index, row) {
        let para = {id: row.id, status: 0};
        this.$confirm('确认删除选中用户吗？', '提示', {
          type: 'warning'
        }).then(() => {
          userUpdate(para).then((res) => {
            if(res.data.success){
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.init();
            }
            else {
              if(res.data.error.code === 3) this.g();
              else {
                this.$message.error('删除错误');
                console.log(res.data.error.code);
              }
            }
          })
        })

      },
      cancel() {
        this.addFormVisible = false;
      },
      handleAdd() {
        this.addFormVisible = true;
        this.addForm = {
          name: '',
          number: '',
          sclass: '',
          did: '',
          datetime: '',
          level: '',
          phone: '',
        }
      },
      addSubmit() {
        this.$refs['addForm'].validate((valid) => {
          if (valid) {
            let para = Object.assign({}, this.addForm);
            console.log(para);
            para.level = parseInt(para.level);
            para.password = this.$md5(para.number);
            para.datetime = para.datetime.getTime();
            console.log(para);
            createStudent(para).then((res) => {
              if (res.data.success === 0) {
                if (res.data.error.code === 3) this.g();
                else if (res.data.error.code === 7) this.$message.error('该学号已存在！');
                else this.$router.push('/error');
              }
              else {
                this.$message({
                  type: 'success',
                  message: '新增学生成功'
                });
                this.init();
                this.addFormVisible = false;
              }
            })
          }
        });
      },
      f1(res) {
        this.cid = res.data.result.c2[0];
        findCollege({id:this.cid}).then((res) => {
          if(res.data.success){
            this.sid = res.data.result.college.sid;
          }
          else this.$router.push('/error');
        });
        this.init();
      },
      f2(res) {
        this.cid = res.data.result.c1[0];
        this.ableEdit = false;
        this.init();
      },
      f3(res) {
        this.cid = res.data.result.cid;
        this.ableEdit = false;
        this.init();
      },
      rootInit(){
        this.title = this.$store.getters.getTitle;
        console.log(this.title);
        this.userId = this.$store.getters.getUserId;
        this.userId = parseInt(this.userId.toString());
        if (this.title === '队长') {
          findStudentById({id: this.userId}).then((res) => {
            if (res.data.success === 0) {
              if (res.data.error.code === 3) {
                this.reLogin().then(() => {
                  findStudentById({id: this.userId}).then((res1) => {
                    this.f3(res1);
                  })
                })
              } else this.$router.push('/error');
            } else {
              this.f3(res);
            }
          })
        }
        else if (this.title === '工时管理员') {
          findCollege().then((res) => {
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
          })
        }
        else if (this.title === '指导老师') {
          findCollege().then((res) => {
            console.log(res.data);
            if (res.data.success === 0) {
              if (res.data.error.code === 3) {
                this.reLogin().then(() => {
                  findCollege().then((res1) => {
                    if (res1.data.success === 0) this.$router.push('/error');
                    else this.f2(res1);
                  })
                })
              }
              else this.$router.push('/error');
            }
            else this.f2(res);
          })
        }
      },
    },
    mounted() {
      this.rootInit();
    }
  }
</script>

<style scoped>

</style>
