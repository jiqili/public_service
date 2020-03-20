<template>
  <div>
    <el-col :span="24" class="toolbar" style="text-align: left;padding-top: 10px;background-color: rgb(242, 242, 242)">
      <!--功能框-->
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="batchAdd" :disabled="this.sels.length===0" style="margin-left: 5px">批量增加</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table :data="students" highlight-current-row style="width: 100%;" @selection-change="selsChange">
      <el-table-column type="selection"  width="55">
      </el-table-column>
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="number" label="学号" width="120" sortable>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="200" >
      </el-table-column>
      <el-table-column prop="dname" label="部门" width="200">
      </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar" style="text-align: left;">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <el-dialog title="新增" :visible.sync="addFormVisible" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="90px" :rules="addFormRules" ref="addForm">
        <el-form-item label="时间" style="text-align: left;" prop="time">
          <div class="block">
            <el-date-picker
              v-model="addForm.time"
              type="datetime"
              style="width: 100%;"
              placeholder="选择活动时间">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="地点" prop="place">
          <el-input v-model="addForm.place" auto-complete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="时长" prop="hour">
          <el-input v-model="addForm.hour" auto-complete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="证明人" prop="reference">
          <el-input v-model="addForm.reference" auto-complete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="description">
          <el-input v-model="addForm.description" auto-complete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="校内/校外" style="text-align: left" prop="type">
          <el-radio v-model="addForm.type" label="0" style="padding-left: 20px">校内</el-radio>
          <el-radio v-model="addForm.type" label="1">校外</el-radio>
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
  import {listStudents,createRecord,findCollege} from "@/api/api";
  import global from '@/components/global';
  export default {
    data (){
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
        total:0,
        cid:'',
        userId:'',
        title:'',
        page:1,
        sels:[],
        addFormVisible:false,
        students:[],
        addForm:{
          time:'',
          place:'',
          hour:'',
          type:'',
          reference:'',
          description:'',
        },
        addFormRules:{
          time:[
            { required: true, message: '请输入活动时间', trigger: 'blur' },
          ],
          place:[
            { required: true, message: '请输入活动地点', trigger: 'blur' },
          ],
          hour:[
            { required: true, message: '请输入活动时长', trigger: 'blur' },
            {validator: checkId, trigger: 'blur'}
          ],
          type:[
            { required: true, message: '请输入工时类型', trigger: 'blur' },
          ],
          reference:[
            { required: true, message: '请输入工时证明人', trigger: 'blur' },
          ],
          description:[
            { required: true, message: '请输入活动内容', trigger: 'blur' },
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
        let month = date.getMonth()+ 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
      },
      reLogin() {
        let para = {id:this.$store.getters.getUserId,password:this.$store.getters.getPassword};
        para.id = parseInt(para.id.toString());
        return this.axios.post(`http://localhost:8080/public_service/user/login`,para);
      },
      f(res) {
        this.students = res.data.result.list;
        this.total = res.data.result.total;
      },
      init(){
        listStudents({cid:this.cid,tbegin:12345678910,tend:12345678910,page:this.page,num:10}).then((res) => {
          if(res.data.success === 0){
            if(res.data.error.code === 3) {
              this.reLogin().then(() => {
                listStudents({cid:this.cid,tbegin:12345678910,tend:12345678910,page:this.page,num:10}).then((res1) => {
                  if(res1.data.success === 0) this.$router.push('/error');
                  else this.f(res1);
                })
              })
            }
            else this.$router.push('/error');
          }
          else this.f(res);
        })
      },
      handleCurrentChange(val) {
        this.page = val;
        this.init();
      },
      selsChange:function (sels) {
        this.sels = sels;
      },
      batchAdd(){
        this.addFormVisible = true;
        this.addForm = {
          time:'',
          place:'',
          hour:'',
          type:'',
          reference:'',
          description:'',
        }
      },
      cancel(){
        this.addFormVisible = false;
        this.$refs['addForm'].resetField();
      },
      addSubmit(){
        this.$refs['addForm'].validate((valid) => {
          if (valid){
            console.log('here');
            let ids = this.sels.map(item => item.id);
            let para = Object.assign({}, this.addForm);
            para.sids = ids;
            para.hour = parseInt(para.hour);
            para.hour = para.hour * 1.0;
            para.time = para.time.getTime();
            para.type = parseInt(para.type);
            console.log(para);
            createRecord(para).then((res) => {
              console.log(res.data);
              if(res.data.success === 0){
                if(res.data.error.code === 3){
                  this.g();
                }
                else this.$router.push('/error');
              }
              else {
                this.$message({
                  type:'success',
                  message:'批量增加成功,请到工时管理界面查看'
                });
                this.init();
                this.addFormVisible = false;
              }
            })
          }
        });
      },
      f1(res){
        this.cid = res.data.result.c2[0];
        console.log(this.cid);
        this.init();
      },
    },
    mounted() {
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
            }
            else this.$router.push('/error');
          }
          else this.f1(res);
        });
      }
    }
  }
</script>

<style scoped>

</style>
