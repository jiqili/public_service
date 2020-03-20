<template>
  <div>
    <el-col :span="24" class="toolbar" style="text-align: left;padding-top: 10px;background-color: rgb(242, 242, 242)">
      <!--功能框-->
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.number" placeholder="工号" clearable="true"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleSearchUser" >查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleAdd">新增</el-button>
        </el-form-item>
        <el-form-item style="float: right;padding-right: 50px">
          <el-checkbox v-model="checked" @change="handleCheckChange">显示已离校用户</el-checkbox>
        </el-form-item>
      </el-form>
    </el-col>

    <template>
      <!--表格-->
      <el-table :data="users" highlight-current-row   @selection-change="selsChange" style="width: 100%;">
        <el-table-column type="selection"  width="55">
        </el-table-column>
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="number" label="工号" width="120">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120" sortable>
        </el-table-column>
        <el-table-column prop="permission" label="权限" width="100" sortable>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120" sortable>
        </el-table-column>
        <el-table-column prop="datetime" label="时刻" width="180" :formatter="formatdate" sortable>
        </el-table-column>
        <el-table-column prop="cname" label="负责学院" width="180">
        </el-table-column>
        <el-table-column label="操作" width="400">
          <template scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" size="small" v-loading="delLoading" @click="handleDel(scope.$index, scope.row)">删除</el-button>
            <el-dropdown @command="handleCommand" trigger="click">
              <el-button size="small" @click="handleId(scope.$index,scope.row)" >设置<i class="el-icon-arrow-down el-icon--right"></i></el-button>
              <el-dropdown-menu slot="dropdown" >
                <el-dropdown-item command="a">工时管理员</el-dropdown-item>
                <el-dropdown-item command="b">指导老师</el-dropdown-item>
                <el-dropdown-item command="c">撤销工时管理员</el-dropdown-item>
                <el-dropdown-item command="d">撤销指导老师</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!--批量删除 && 分页-->
      <el-col :span="24" class="toolbar" style="text-align: left;">
        <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" :current-page="page" style="float:right;">
        </el-pagination>
      </el-col>
      <!--新增用户-->
      <el-dialog title="新增" :visible.sync="addFormVisible" v-model="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="工号" prop="number">
            <el-input v-model="addForm.number" auto-complete="off" clearable="true"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="addForm.name" auto-complete="off" clearable="true"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" clearable="true">
            <el-input type="password" v-model="addForm.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="权限" prop="permission" style="text-align: left">
            <el-radio v-model="addForm.permission" label="-1" style="padding-left: 20px">管理员</el-radio>
            <el-radio v-model="addForm.permission" label="0">普通用户</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>
      <!--设置职务-->
      <el-dialog title="设置职务" :visible.sync="dialogFormVisible">
        <el-select v-model="collegeSelect" placeholder="请选择负责学院">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitDialog">确 定</el-button>
        </div>
      </el-dialog>
    </template>
  </div>
</template>

<script>
  import {getUserList,findUser,listColleges,createUser,userUpdate,findStudentById} from "@/api/api";
  import global from '@/components/global';
  export default {
      data() {
        return {
          filters: {
            number:''
          },
          permission:'',
          selectId:'',
          selectType:0,
          collegeSelect:'',
          dialogFormVisible:false,
          recordManager:global.recordManager,
          users:[],
          total: 0,
          page: 1,
          listLoading: false,
          sels: [],
          checked: false,
          delLoading: false,
          selectCollege:true,
          addFormVisible: false,
          addLoading: false,
          options:[],
          checkPermission:[true,true,true,true],
          addFormRules: {
            number: [
              { required: true, message: '请输入工号', trigger: 'blur' },
            ],
            name: [
              { required: true, message: '请输入姓名', trigger: 'blur' }
            ],
            password: [
              {required: true, message: '请输入密码', trigger: 'blur'}
            ],
            permission: [
              { required: true, message: '请选择用户身份', trigger: 'blur' }
            ]
          },
          addForm: {
            number: '',
            name: '',
            password:'',
            permission:'',
            status:'',
            cid:'',
          }
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
        handleCurrentChange(val) {
          this.page = val;
          if(this.filters.number === '') this.getUser();
          else {
            this.searchUser();
          }
        },
        handleCheckChange(){
          if(this.filters.number === '') {
            this.page = 1;
            this.getUser();
          }
          else {
            this.page = 1;
            this.searchUser();
          }
        },
        handleSearchUser(){
          this.page = 1;
          if(this.filters.number === '') this.getUser();
          else this.searchUser();
        },
        searchUser: function () {
          this.listLoading = true;
          let para = {prefix :this.filters.number,status :1,num :10,page : this.page};
          if(this.checked)  {
            delete para.status;
          }
          console.log(para);
          getUserList(para).then((res) => {
            if(res.data.success){
              this.users = res.data.result.list;
              for(let i=0;i<this.users.length;i++){
                if(this.users[i].status === 1){
                  this.users[i].status = '在校';
                }
                else {
                  this.users[i].status = '离校';
                }
                if(this.users[i].permission === -1){
                  this.users[i].permission = '管理员';
                }
                else if(this.users[i].permission === global.recordManager){
                  this.users[i].permission = '工时管理员';
                  if(this.users[i].cname2 !== null)
                    this.users[i].cname = this.users[i].cname + '/' + this.users[i].cname2;
                }
                else if(this.users[i].permission === 0){
                  this.users[i].permission = '普通用户';
                  this.users[i].cname = this.users[i].cname2;
                }
              }
              this.total = res.data.result.total;
              this.listLoading = false;
            }
            else if(res.data.error.code === 3) this.g();
            else this.$router.push('/error');
          })
        },
        reLogin() {
          let para = {id:this.$store.getters.getUserId,password:this.$store.getters.getPassword};
          para.id = parseInt(para.id.toString());
          return this.axios.post(`http://localhost:8080/public_service/user/login`,para);
        },
        f(res) {
          this.total = res.data.result.total;
          this.users = res.data.result.list;
          for(let i=0;i<this.users.length;i++){
            if(this.users[i].status === 1){
              this.users[i].status = '在校';
            }
            else {
              this.users[i].status = '离校';
            }
            if(this.users[i].permission === -1){
              this.users[i].permission = '管理员';
            }
            else if(this.users[i].permission === global.recordManager){
              this.users[i].permission = '工时管理员';
              if(this.users[i].cname2 !== null)
              this.users[i].cname = this.users[i].cname + '/' + this.users[i].cname2;
            }
            else if(this.users[i].permission === 0){
              this.users[i].permission = '普通用户';
              this.users[i].cname = this.users[i].cname2;
            }
          }
          listColleges().then((res1) => {
            if(res1.data.success === 0) this.$router.push('/error');
            else {
              this.options = res1.data.result;

            }
          });
          this.listLoading = false;
          console.log(this.page);
        },
        g() {
          this.$router.go(0);
          this.$message({
            message: '重新登录成功！',
            type: 'success'
          });
        },
        getUser: function () {
          this.listLoading = true;
          let para = {
            status:1,
            num:10,
            page:this.page,
          };
          if(this.checked)  {
            delete para.status;
          }
          getUserList(para).then((res) => {
            if(res.data.success === 0 && res.data.error.code === 3){
              this.reLogin().then(() => { getUserList(para).then(res1 => {
                if (res1.data.success === 0) {
                  if(res1.data.error.code === 3) this.g();
                  else  this.$router.push('/error');
                } else {
                  this.f(res1);
                }
              });
              });
            }
            else {
              this.f(res);
            }
          });
        },
        handleEdit:function(index,row) {
          this.$router.push({path:'/userInfo',query: {userId: Object.assign({},row).id}});
        },
        submitDialog(){
          this.dialogFormVisible = false;
          let para = {id:this.selectId};
          if(this.selectType === 1) {
            para.cid = this.collegeSelect;
            para.permission = global.recordManager;
          }
          else para.cid2 = this.collegeSelect;
          console.log(para);
          userUpdate(para).then((res) => {
            console.log(res.data);
            if(res.data.success){
              this.$message({
                type:'success',
                message:'成功设置职务'
              });
              this.getUser();
            }
            else {
              if(res.data.error.code === 3) this.g();
              else if(res.data.error.code === 21) {
                this.$confirm('该学院已经存在工时管理员, 是否覆盖?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  para.override = 1;
                  userUpdate(para).then((res1) => {
                    if(res1.data.success) {
                      this.$message({
                        type:'success',
                        message:'工时管理员设置成功'
                      });
                      this.getUser();
                    }
                    else this.$message.error('工时管理员设置失败');
                  })
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消'
                  });
                });
              }
              else if(res.data.error.code === 22) {
                this.$confirm('该学院已经存在指导老师, 是否覆盖?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  para.override = 1;
                  userUpdate(para).then((res1) => {
                    if(res1.data.success) {
                      this.$message({
                        type:'success',
                        message:'指导老师设置成功'
                      });
                      this.getUser();
                    }
                    else this.$message.error('指导老师设置失败');
                  })
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消'
                  });
                });
              }
              else this.$message.error('设置职务失败！');
            }
          });
        },
        handleId(index,row){
          this.selectId = Object.assign({},row).id;
          this.permission = Object.assign({},row).permission;
          this.checkPermission = [true,true,true,true];
          findUser({id:this.selectId}).then((res) => {
            if(res.data.success){
              if(res.data.result.cname2 !== null && res.data.result.permission === global.recordManager) {

              }
              else if(res.data.result.cname2 !== null && res.data.result.permission === 0) {
                this.checkPermission[2] = false;
              }
              else if(res.data.result.cname2 === null && res.data.result.permission === global.recordManager) {
                this.checkPermission[3] = false;
              }
              else if(res.data.result.cname2 === null && res.data.result.permission === 0) {
                findStudentById({id:this.selectId}).then((res1) => {
                  if(res1.data.success) this.checkPermission = [false,false,false,false];
                  else if(res1.data.error.code === 14) {
                    this.checkPermission[3] = false;
                    this.checkPermission[2] = false;
                  }
                  else this.$message.error('获取用户信息错误！');
                });
              }
              else if(res.data.result.permission === -1) this.checkPermission = [false,false,false,false];
              console.log(this.checkPermission);
            }
            else if(res.data.error.code === 3) this.g();
            else this.$message.error('获取该用户信息错误！');
          })
        },
        handleCommand(command){
          if(command === 'a') {
            if(this.checkPermission[0]){
              this.selectType = 1;
              this.dialogFormVisible = true;
            }
            else this.$message.error('该用户不可设为工时管理员！');
          }
          else if(command === 'b'){
            if(this.checkPermission[1]){
              this.selectType = 2;
              this.dialogFormVisible = true;
            }
            else this.$message.error('该用户不可设为指导老师！');
          }
          else if(command === 'c'){
            if(this.checkPermission[2]){
              this.$confirm('确定撤销工时管理员权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                userUpdate({id:this.selectId,cid:null}).then((res) => {
                  if(res.data.success){
                    this.$message({
                      type:'success',
                      message:'成功撤销工时管理员权限'
                    });
                    this.getUser();
                  }
                  else if(res.data.error.code === 3) this.g();
                  else this.$message.error('撤销工时管理员权限失败');
                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                });
              });
            }
            else this.$message.error('该用户无工时管理员权限，故不可撤销！');
          }
          else {
            if(this.checkPermission[3]){
              this.$confirm('确定撤销指导老师, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                userUpdate({id:this.selectId,cid2:null}).then((res) => {
                  if(res.data.success){
                    this.$message({
                      type:'success',
                      message:'成功撤销指导老师'
                    });
                    this.getUser();
                  }
                  else if(res.data.error.code ===3 ) this.g();
                  else this.$message.error('撤销指导老师失败');
                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                });
              });
            }
            else this.$message.error('该用户不是指导老师，故不可撤销！');
          }
        },
        handleDel(index,row) {
          let para = {id:row.id,status:0};
          this.$confirm('确认删除选中用户吗？','提示',{
            type: 'warning'
          }).then(() => {
            userUpdate(para).then((res) => {
              if(res.data.success){
                this.$message({
                  message:'删除成功',
                  type: 'success'
                });
                this.getUser();
              }
              else if(res.data.error.code === 3) this.g();
              else if(res.data.error.code === 8) this.$message.error('不能修改自己的状态！');
              else this.$message.error(res.data.error.msg);
            })
          })

        },
        handleAdd: function () {
          this.addFormVisible = true;
          // console.log(this.addFormVisible);
          this.addForm = {
            number: '',
            name: '',
            password:'',
            permission:'',
            status:1,
            cid:'',
          };
        },
        addSubmit: function () {
          this.$refs.addForm.validate((valid) => {
            if (valid) {
              this.$confirm('确认提交吗？', '提示', {}).then(() => {
                this.addLoading = true;
                let para = Object.assign({}, this.addForm);
                if(para.cid === '') delete para.cid;
                para.permission = parseInt(para.permission.toString());
                para.password = this.$md5(para.password);
                console.log(para);
                createUser(para).then((res) => {
                  this.addLoading = false;
                  console.log(res.data);
                  if(res.data.success===0 && res.data.error.code===7){
                    this.$message.error('该学号已存在！');
                  }
                  if(res.data.success === 0){
                    if(res.data.error.code === 7) this.$message.error('该学号已存在！');
                    else if(res.data.error.code === 3) this.g();
                  }
                  else {
                    this.$message({
                      message: '提交成功',
                      type: 'success'
                    });
                    this.$refs['addForm'].resetFields();
                    this.addFormVisible = false;
                    this.getUser();
                  }
                });
              });
            }
          });
        },
        selsChange:function (sels) {
          this.sels = sels;
        },
        batchRemove:function () {
          let ids = this.sels.map(item => item.id);
          this.$confirm('确认删除选中记录吗？','提示',{
            type:'warning'
          }).then(() => {
            this.listLoading = true;
            for(let i=0;i<ids.length;i++){
              let para = {id: ids[i], status: 0};
              userUpdate(para).then((res) => {
                if(res.data.success){
                  this.$message({
                    message:'删除成功',
                    type: 'success'
                  });
                }
                else if(res.data.error.code === 3) this.g();
                else this.$message.error(res.data.error.msg);
                this.listLoading = false;
                this.getUser();
              });
            }
          })
        }
      },
      mounted() {
        this.getUser();
      }
    }
</script>

<style scoped>

</style>
