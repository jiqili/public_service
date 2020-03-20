<template>
  <div>
    <el-col :span="24" class="toolbar" style="text-align: left;padding-top: 10px;background-color: rgb(242, 242, 242)">
      <!--功能框-->
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="num" placeholder="学号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <div class="block">
            <el-date-picker
              v-model="timeRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table :data="record" highlight-current-row style="width: 100%;">
      <el-table-column type="index" width="40">
      </el-table-column>
      <el-table-column prop="snumber" label="学号" width="100" >
      </el-table-column>
      <el-table-column prop="sname" label="姓名" width="150" >
      </el-table-column>
      <el-table-column prop="time" label="时间" width="200" sortable>
      </el-table-column>
      <el-table-column prop="place" label="地点" width="200" >
      </el-table-column>
      <el-table-column prop="hour" label="时长" width="50">
      </el-table-column>
      <el-table-column prop="type" label="校内/校外" width="100">
      </el-table-column>
      <el-table-column prop="datetime" label="注册时间" width="200">
      </el-table-column>
      <el-table-column prop="reference" label="证明人" width="120">
      </el-table-column>
      <el-table-column prop="description" label="内容" >
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
          <el-button type="danger" size="small" v-loading="delLoading" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar" style="text-align: left;">
      <el-button type="primary" @click="handleAdd">新增</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :current-page="page" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <el-dialog title="新增" :visible.sync="addFormVisible" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="90px" :rules="addFormRules" ref="addForm">
        <el-form-item label="学号" prop="number">
          <el-input v-model="addForm.number" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="time" style="text-align: left;" >
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
          <el-input v-model="addForm.place" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="时长" prop="hour">
          <el-input v-model="addForm.hour" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="证明人" prop="reference">
          <el-input v-model="addForm.reference" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="description">
          <el-input v-model="addForm.description" auto-complete="off"></el-input>
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
  import {listRecords,findUser,createRecord,deleteRecord,findCollege} from "@/api/api";
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
        cid:'',
        userId:'',
        title:'',
        total:0,
        page:1,
        num:'',
        addFormVisible:false,
        addForm:{
          number:'',
          time:'',
          place:'',
          duration:'',
          type:'',
          reference:'',
          description:'',
        },
        addFormRules:{
          number:[
            { required: true, message: '请输入学号', trigger: 'blur' },
          ],
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
        record:[],
        timeRange:[],
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
      f(res){
        this.record = res.data.result.list;
        for(let i in this.record){
          if(this.record[i].type === 0) this.record[i].type = '校内';
          else this.record[i].type = '校外';
          this.record[i].time = this.formatDate(this.record[i].time);
          this.record[i].datetime = this.formatDate(this.record[i].datetime);
        }
        this.total = res.data.result.total;
      },
      init(){
        listRecords({page:this.page,num:10,cid:this.cid}).then((res) => {
          console.log('here1');
          console.log(res.data);
          if(res.data.success === 0){
            if(res.data.error.code === 3){
              this.reLogin().then(() => {
                listRecords({page:this.page,num:10}).then((res1) => {
                  if(res1.data.success === 0){
                    this.$router.push('/error');
                  }
                  else {
                    this.f(res1);
                  }
                })
              })
            }
            else this.$router.push('/error');
          }
          else this.f(res);
        })
      },
      handleQuery(){
        console.log(this.timeRange);
        this.page = 1;
        if(this.num === '' && (this.timeRange === null || this.timeRange.length === 0)) this.init();
        else if(this.num === '' && this.timeRange !== null && this.timeRange.length === 2) this.Query1();
        else if(this.num !== '') this.Query2();
        else this.$message.error('正确选择筛选条件！');
      },
      Query1(){
        listRecords({page:this.page,num:10,cid:this.cid,tbegin:this.timeRange[0].getTime(),tend:this.timeRange[1].getTime()}).then((res) => {
          console.log('here1');
          console.log(res.data);
          if(res.data.success === 0){
            if(res.data.error.code === 3){
              this.reLogin().then(() => {
                listRecords({page:this.page,num:10}).then((res1) => {
                  if(res1.data.success === 0){
                    this.$router.push('/error');
                  }
                  else {
                    this.f(res1);
                  }
                })
              })
            }
            else this.$router.push('/error');
          }
          else this.f(res);
        })
      },
      Query2(){
        findUser({number:this.num}).then((res) => {
          console.log(res.data);
          if(res.data.success === 0){
            if(res.data.error.code === 3) this.g();
            else if(res.data.error.code === 6) this.$message.error('该学生不存在！');
            else this.$message.error('查询该学号失败！');
          }
          else {
            let para = {sid:res.data.result.id,page:this.page,num:10};
            if(this.timeRange !== null && this.timeRange.length === 2){
              para.tbegin = this.timeRange[0].getTime();
              para.tend = this.timeRange[1].getTime();
            }
            listRecords(para).then((res1) => {
              console.log(res1.data);
              if(res1.data.success === 0){
                if(res1.data.error.code === 14) this.$message.error('该学生不存在！');
                else this.$router.push('/error');
              }
              else {
                this.record = res1.data.result.list;
                for(let i in this.record){
                  if(this.record[i].type === 0) this.record[i].type = '校内';
                  else this.record[i].type = '校外';
                  this.record[i].time = this.formatDate(this.record[i].time);
                  this.record[i].datetime = this.formatDate(this.record[i].datetime);
                }
                this.total = res1.data.result.total;
              }
            })
          }
        })
      },
      handleCurrentChange(val) {
        this.page = val;
        if(this.num === '' && (this.timeRange === null || this.timeRange.length === 0)) this.init();
        else if(this.num === '' && this.timeRange.length === 2) this.Query1();
        else if(this.num !== '') this.Query2();
      },
      handleEdit(index,row) {
        this.$router.push({path:'/recordInfo',query: {recordId: Object.assign({},row).id}});
      },
      handleDel(index,row) {
        let para = {ids:[row.id]};
        this.$confirm('确认删除选中用户吗？','提示',{
          type: 'warning'
        }).then(() => {
          deleteRecord(para).then((res) => {
            if(res.data.success === 0){
              if(res.data.error.code ===3){this.g();}
              else this.$router.push('/error');
            }
            else
            {this.$message({
              message:'删除成功',
              type: 'success'
            });
            this.init();}
          })
        })

      },
      handleAdd(){
        this.addFormVisible = true;
        this.addForm = {
          number:'',
          time:'',
          place:'',
          hour:'',
          type:'',
          datetime:'',
          reference:'',
        }
      },
      cancel(){
        this.addFormVisible = false;
      },
      addSubmit: function(){
        this.$refs.addForm.validate((valid) => {
          if (valid){
            let para = Object.assign({}, this.addForm);
            para.time = para.time.getTime();
            para.hour = parseInt(para.hour);
            para.hour = para.hour * 1.0;
            para.type = parseInt(para.type.toString());
            findUser({number:para.number}).then((res) => {
              if(res.data.success === 0){
                if(res.data.error.code === 3) this.g();
                else if(res.data.error.code === 6) this.$message.error('该学生不存在！');
                else this.$message.error('查询该学号失败！');
              }
              else {
                para.sids = [res.data.result.id];
                delete para.number;
                console.log(para);
                createRecord(para).then((res1) => {
                  console.log(res1.data);
                  if(res1.data.success === 0){
                    if(res1.data.error.code === 14) this.$message.error('该学生不存在！');
                    else {
                      this.$router.push('/error');
                    }
                  }
                  else {
                    this.$message({
                      type:'success',
                      message:'成功添加工时记录'
                    });
                    this.init();
                    this.addFormVisible = false;
                  }
                })
              }
            });
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
    }
  }
</script>

<style scoped>

</style>
