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
      </el-form>
    </el-col>
    <el-table :data="record" highlight-current-row style="width: 100%;">
      <el-table-column type="index" width="30">
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
      <el-table-column prop="description" label="内容" width="400">
      </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar" style="text-align: left;">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
  </div>
</template>

<script>
  import {listRecords,findUser,} from "@/api/api";
  import global from '@/components/global';
  export default {
    name: "recordQueryByLeader",
    data (){
      return {
        total:0,
        page:1,
        id:'',
        record:[],
        timeRange:[],
      }
    },
    methods: {
      reLogin() {
        let para = {id:this.$store.getters.getUserId,password:this.$store.getters.getPassword};
        para.id = parseInt(para.id.toString());
        return this.axios.post(`http://localhost:8080/public_service/user/login`,para);
      },
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
      f(res){
        console.log('here2');
        console.log(res.data);
        this.record = res.data.result.list;
        for(let i in this.record){
          this.record[i].time = this.formatDate(this.record[i].time);
          this.record[i].datetime = this.formatDate(this.record[i].datetime);
        }
        this.total = res.data.result.total;
      },
      init(){
        this.id = this.$store.getters.getUserId;
        this.id = parseInt(this.id.toString());
        let para = {sid:this.id,page:this.page,num:10};
        if(this.timeRange !== null && this.timeRange.length === 2) {
          para.tbegin = this.timeRange[0].getTime();
          para.tend = this.timeRange[1].getTime();
        }
        listRecords(para).then((res) => {
          console.log('here1');
          console.log(res.data);
          if(res.data.success === 0){
            if(res.data.error.code === 3) {
              this.reLogin().then(() => {
                listRecords(para).then((res1) => {
                  if(res1.data.success === 0){
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
      handleQuery(){
        this.page = 1;
          this.init();
      },
      handleCurrentChange(val) {
        this.page = val;
        this.init();
      },
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>

</style>
