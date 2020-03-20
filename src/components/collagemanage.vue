<template>
    <div>
      <el-col :span="24" class="toolbar" style="text-align: left">
        <el-button type="primary" v-on:click="handleAdd" >新增</el-button>
      </el-col>

      <el-table :data="collages" highlight-current-row>
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="id" label="院号" width="150" sortable>
        </el-table-column>
        <el-table-column prop="name" label="院名" width="200" >
        </el-table-column>
        <el-table-column prop="tname" label="指导老师" width="200" >
        </el-table-column>
        <el-table-column prop="sname" label="队长" width="200" >
        </el-table-column>
        <el-table-column prop="uname" label="工时管理员" width="200" >
        </el-table-column>
        <el-table-column label="操作" width="400">
          <template scope="scope" >
            <el-button size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="新增" :visible.sync="addFormVisible" v-model="addFormVisible" visible_syn :close-on-click-modal="false">
        <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
          <el-form-item  label="院名" prop="name">
            <el-input v-model="addForm.name" auto-complete="off" clearable="true"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

    </div>
</template>

<script>
  import {findCollege,listColleges,createCollege,deleteCollege,collageUpdate,findUser} from "@/api/api";
  import global from '@/components/global';
    export default {
      data() {
        return {
          collages:[],
          addFormVisible: false,
          listLoading: false,
          addLoading: false,
          delLoading: false,
          total: 0,
          page: 1,
          addForm: {
            name: '',
          },
          addFormRules: {
            name: [
              {required:true,message: '请输入院名',trigger:'blur'}
            ],
          }
        }
      },
      methods: {
        reLogin() {
          let para = {id:this.$store.getters.getUserId,password:this.$store.getters.getPassword};
          para.id = parseInt(para.id.toString());
          return this.axios.post(`http://localhost:8080/public_service/user/login`,para);
        },
        async g() {
          this.$router.go(0);
          this.$message({
            message: '重新登录成功！',
            type: 'success'
          });
        },
        f(res){
          this.collages = res.data.result;
          this.total = res.data.result.length;
          this.listLoading = false;
        },
        getCollage: function () {
          this.listLoading = true;
          let para = null;
          listColleges(para).then((res) => {
            console.log(res.data);
            if(res.data.success === 0 && res.data.error.code === 3){
              this.reLogin().then(() => {
                listColleges(para).then((res1) => {
                  if(res1.data.success === 0){
                    this.$router.push('/error');
                  }
                  else {
                    this.f(res1);
                  }
                })
              })
            }
            else {
              this.f(res);
            }
          });
        },
        addSubmit: function () {
          this.$refs.addForm.validate((valid) => {
            if (valid) {
              this.$confirm('确认提交吗？', '提示', {}).then(() => {
                this.addLoading = true;
                let para = {name:this.addForm.name};
                createCollege(para).then((res) => {
                  this.addLoading = false;
                  console.log(res.data);
                  if(res.data.success === 0){
                    if(res.data.error.code===11) this.$message.error('该院名已存在！');
                    else if(res.data.error.code ===3) this.g();
                    else this.$message.error('添加学院失败！');
                  }
                  else {
                    this.$message({
                      message: '提交成功',
                      type: 'success'
                    });
                    this.$refs['addForm'].resetFields();
                    this.addFormVisible = false;
                    this.getCollage();
                  }
                });
              });
            }
          });
        },
        handleEdit: function (index,row) {
          this.$router.push({path:'/collageInfo',query: {collageId: Object.assign({},row).id}});
        },
        handleDel:function(index,row) {
          this.$confirm('确认删除？','提示',{type: 'warning'}).then(()=>{
            let para = {id: Object.assign({},row).id};
            deleteCollege(para).then((res) => {
              if(res.data.success === 0){
                if(res.data.error.code === 3){
                  this.g();
                }
                else if(res.data.error.code === 13){
                  this.$message.error('该学院下还有部门！');
                }
                else this.$router.push('/error');
              }
              else {
                this.$message({
                  message:'删除成功',
                  type: 'success'
                });
                this.getCollage();
              }
            });
          }).catch(()=>{});
        },
        handleAdd: function () {
          this.addFormVisible = true;
          this.addForm = {
            name: '',
            tid: ''
          }
        }
      },
      mounted() {
        this.getCollage();
      }
    }
</script>

<style scoped>

</style>
