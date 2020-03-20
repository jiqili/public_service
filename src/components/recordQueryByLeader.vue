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
        <el-button type="primary" @click="handleQuery">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleExport2" :disabled="timeRange==null || timeRange.length !== 2">导出</el-button>
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
    <el-table-column prop="dname" label="部门" width="120" >
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
    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :current-page="page" :total="total" style="float:right;">
    </el-pagination>
  </el-col>
</div>
</template>

<script>
  import {listStudents,listDepartments,findStudentById,findCollege} from "@/api/api";
  import global from '@/components/global';
  export default {
        name: "recordQueryByLeader",
      data (){
          return {
            selectedDepart:'',
            total:0,
            cid:'',
            title:'',
            userId:'',
            page:1,
            record:[],
            timeRange:[],
            checked:false,
            options:[],
          }
      },
      methods: {
        handleExport2(){
          this.axios.post('http://localhost:8080/public_service/student/export', {
            cid: this.cid,
            tbegin: this.timeRange[0].getTime(),
            tend: this.timeRange[1].getTime()
          }, {responseType: 'arraybuffer'}).then((res) => {
            console.log(res.data);
            if (res.status === 200) {
              let blob = new Blob([res.data], {type: "application/vnd.ms-excel"});
              window.location.href = URL.createObjectURL(blob);
            }
          }, (err) => {
            console.log(err);
          });
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
          let para = {page:this.page,num:10,cid:this.cid,tbegin:123456789100,tend:123456789100};
          if(this.checked) para.all = 0;
          if(this.selectedDepart !== ''){
            this.selectedDepart = parseInt(this.selectedDepart);
            para.did = this.selectedDepart;
          }
          if(this.timeRange !== null && this.timeRange.length === 2) {
            para.tbegin = this.timeRange[0].getTime();
            para.tend = this.timeRange[1].getTime();
          }
          listStudents(para).then((res) => {
            console.log(res.data);
            if(res.data.success === 0){
                this.$router.push('/error');
            }
            else {
              this.f(res);
            }
          })
        },
        init(){
          listDepartments({cid:this.cid}).then((res) => {
            if(res.data.success === 0){
              this.$router.push('/error');
            }
            else {
              this.options = res.data.result;
              this.f1();
            }
          });
        },
        handleQuery(){
          this.page = 1;
          this.f1();
        },
        handleCurrentChange(val) {
          this.page = val;
          this.f1();
        },
        f3(res){
          this.cid = res.data.result.cid;
          this.init();
        },
        f2(res){
          this.cid = res.data.result.c1[0];
          this.init();
        },
      },
      mounted() {
        this.userId = this.$store.getters.getUserId;
        this.userId = parseInt(this.userId.toString());
        this.title = this.$store.getters.getTitle;
        if(this.title === '队长'){
          findStudentById({id:this.userId}).then((res) => {
            if(res.data.success === 0) {
              if(res.data.error.code === 3){
                this.reLogin().then(() => {
                  findStudentById({id:this.userId}).then((res1) => {
                    this.f3(res1);
                  })
                })
              }
              else this.$router.push('/error');
            }
            else {
              this.f3(res);
            }
          })
        }
        else if(this.title === '指导老师'){
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
      }
    }
</script>

<style scoped>

</style>
