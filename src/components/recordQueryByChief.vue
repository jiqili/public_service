<template>
  <div>
    <el-col :span="24" class="toolbar" style="text-align: left;padding-top: 10px;background-color: rgb(242, 242, 242)">
      <!--功能框-->
      <el-form :inline="true">
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
        <el-form-item style="float: right;padding-right: 50px">
          <el-checkbox v-model="checked" @change="handleQuery">工时未完成人员筛选</el-checkbox>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table :data="record" highlight-current-row style="width: 100%;">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="number" label="学号" width="150" sortable>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120" >
      </el-table-column>
      <el-table-column prop="should0" label="校内应做工时" width="200">
      </el-table-column>
      <el-table-column prop="sum0" label="校内完成工时" width="200">
      </el-table-column>
      <el-table-column prop="should1" label="校外应做工时" width="200">
      </el-table-column>
      <el-table-column prop="sum1" label="校外完成工时" width="200">
      </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar" style="text-align: left;">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
  </div>
</template>

<script>
  import {listStudents,findStudentById} from "@/api/api";
  import global from '@/components/global';
  export default {
    name: "recordQueryByLeader",
    data (){
      return {
        total:0,
        page:1,
        record:[],
        timeRange:[],
        checked:false,
        did:'',
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
        this.record = res.data.result.list;
        for(let i in this.record){
          if(this.record[i].level === 0) {
            this.record[i].should0 = 0;
            this.record[i].should1 = 0;
          }
          else if(this.record[i].level === 1) {
            this.record[i].should0 = 10;
            this.record[i].should1 = 15;
          }
          else {
            this.record[i].should0 = 25;
            this.record[i].should1 = 25;
          }
        }
        this.total = res.data.result.total;
      },
      f1(){
        let para = {page:this.page,num:10,tbegin:123456789100,tend:123456789100,did:this.did};
        if(this.checked) para.all = 0;
        if(this.timeRange !== null && this.timeRange.length === 2) {
          para.tbegin = this.timeRange[0].getTime();
          para.tend = this.timeRange[1].getTime();
        }
        listStudents(para).then((res) => {
          console.log(res.data);
          if(res.data.success === 0){
            if(res.data.error.code === 3) this.g();
            else this.$router.push('/error');
          }
          else {
            this.f(res);
          }
        })
      },
      init(){
        findStudentById({id:parseInt(this.$store.getters.getUserId.toString())}).then((res) => {
          if(res.data.success === 0){
            if(res.data.error.code === 3) {
              this.reLogin().then(() => {
                findStudentById({id:parseInt(this.$store.getters.getUserId.toString())}).then((res1) => {
                  if(res1.data.success === 0) this.$router.push('/error');
                  else  {
                    this.did = res1.data.result.did;
                    this.f1();
                  }
                })
              })
            }
            else this.$router.push('/error');
          }
          else  {
            this.did = res.data.result.did;
            this.f1();
          }
        })
      },
      handleQuery(){
        this.page = 1;
        this.f1();
      },
      handleCurrentChange(val) {
        this.page = val;
        this.f1();
      },
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>

</style>
