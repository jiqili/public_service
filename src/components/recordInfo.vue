<template>
  <div class="info-container">
    <el-form  class="info-page">
      <el-form-item style="text-align: left">
        <h1>工时记录</h1>
        <hr>
      </el-form-item>
      <el-form-item label="时间" >
        <div class="block ">
          <el-date-picker
            v-model="time"
            :disabled="!isEdit.timeEdit"
            type="datetime"
            size="large"
            class="info-input">
          </el-date-picker>
        </div>
          <el-button type="primary" class="info-button" v-show="!isEdit.timeEdit" @click="editTime">编辑</el-button>
          <el-button class="info-button" v-show="isEdit.timeEdit" @click="cancelEditTime">取消</el-button>
          <el-button type="success" class="info-button" v-show="isEdit.timeEdit" @click="submitTime">保存</el-button>
      </el-form-item>
      <el-form-item label="地点">
        <el-input v-model="place" class="info-input" :readonly="!isEdit.placeEdit" ref="placeInput" clearable></el-input>
        <el-button type="primary" class="info-button" v-show="!isEdit.placeEdit" @click="editPlace">编辑</el-button>
        <el-button  class="info-button" v-show="isEdit.placeEdit" @click="cancelEditPlace">取消</el-button>
        <el-button type="success" class="info-button" v-show="isEdit.placeEdit" @click="submitPlace">保存</el-button>
      </el-form-item>
      <el-form-item label="时长">
        <el-input v-model="hour" class="info-input" :readonly="!isEdit.hourEdit" ref="hourInput" clearable></el-input>
        <el-button type="primary" class="info-button" v-show="!isEdit.hourEdit" @click="editHour">编辑</el-button>
        <el-button  class="info-button" v-show="isEdit.hourEdit" @click="cancelEditHour">取消</el-button>
        <el-button type="success" class="info-button" v-show="isEdit.hourEdit" @click="submitHour">保存</el-button>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="description" class="info-input" :readonly="!isEdit.descriptionEdit" ref="descriptionInput" clearable></el-input>
        <el-button type="primary" class="info-button" v-show="!isEdit.descriptionEdit" @click="editDescription">编辑</el-button>
        <el-button  class="info-button" v-show="isEdit.descriptionEdit" @click="cancelEditDescription">取消</el-button>
        <el-button type="success" class="info-button" v-show="isEdit.descriptionEdit" @click="submitDescription">保存</el-button>
      </el-form-item>
      <el-form-item label="证明人">
        <el-input v-model="reference" class="info-input" :readonly="!isEdit.referenceEdit" ref="referenceInput" clearable style="margin-left: 13px"></el-input>
        <el-button type="primary" class="info-button" v-show="!isEdit.referenceEdit" @click="editReference">编辑</el-button>
        <el-button  class="info-button" v-show="isEdit.referenceEdit" @click="cancelEditReference">取消</el-button>
        <el-button type="success" class="info-button" v-show="isEdit.referenceEdit" @click="submitReference">保存</el-button>
      </el-form-item>
      <el-form-item label="类型">
        <div class="info-input" >
          <el-radio v-model="type" label="0" :disabled="!isEdit.typeEdit">校内</el-radio>
          <el-radio v-model="type" label="1" :disabled="!isEdit.typeEdit">校外</el-radio>
        </div>
          <el-button type="primary" class="info-button" v-show="!isEdit.typeEdit" @click="editType">编辑</el-button>
          <el-button class="info-button" v-show="isEdit.typeEdit" @click="cancelEditType">取消</el-button>
          <el-button type="success" class="info-button" v-show="isEdit.typeEdit" @click="submitType">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {findRecordById,recordUpdate} from "@/api/api";
  import global from '@/components/global';
  export default {
      data() {
          return {
            time:'',
            timeTmp:'',
            place:'',
            placeTmp:'',
            hour:'',
            hourTmp:'',
            id:this.$route.query.recordId,
            description:'',
            descriptionTmp:'',
            type:'',
            typeTmp:'',
            reference:'',
            referenceTmp:'',
            isEdit:{
              timeEdit:false,
              placeEdit:false,
              hourEdit:false,
              descriptionEdit:false,
              typeEdit:false,
              referenceEdit:false,
            }
          }
      },
      methods:{
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
          this.time = this.formatDate(this.time = res.data.result.time);
          this.place = res.data.result.place;
          this.hour = res.data.result.hour;
          this.type = res.data.result.type.toString();
          this.reference = res.data.result.reference;
          this.description = res.data.result.description;
        },
        init(){
          this.id = parseInt(this.id.toString());
          findRecordById({id:this.id}).then((res) => {
            console.log(res.data);
            if(res.data.success === 0){
              if(res.data.error.code === 3){
                this.reLogin().then(() => {
                  findRecordById({id:this.id}).then((res1) => {
                    if(res1.data.success === 0) this.$router.push('/error');
                    else this.f(res1);
                  })
                })
              }
            }
            else this.f(res);
          })
        },
        editTime(){
          this.timeTmp = this.time;
          this.isEdit.timeEdit = true;
        },
        submitTime(){
          this.isEdit.timeEdit = false;
          this.time = new Date(this.time);
          recordUpdate({ids:[this.id],time:this.time.getTime()}).then((res) => {
            if(res.data.success === 0){
              if(res.data.error.code === 3){
                this.go();
              }
              else this.$router.push('/error');
            }
            else {
              this.$message({
                type:'success',
                message:'更新活动时间成功'
              })
            }
          })
        },
        cancelEditTime(){
          this.isEdit.timeEdit = false;
          this.time = this.timeTmp;

        },
        editPlace(){
          this.placeTmp = this.place;
          this.isEdit.placeEdit = true;
          this.$refs['placeInput'].focus();
        },
        submitPlace(){
          this.isEdit.placeEdit = false;
          recordUpdate({ids:[this.id],place:this.place}).then((res) => {
            if(res.data.success === 0){
              if(res.data.error.code === 3){
                this.go();
              }
              else this.$router.push('/error');
            }
            else {
              this.$message({
                type:'success',
                message:'更新活动地点成功'
              })
            }
          })
        },
        cancelEditPlace(){
          this.isEdit.placeEdit = false;
          this.place = this.placeTmp;
        },
        editHour(){
          this.hourTmp = this.hour;
          this.isEdit.hourEdit = true;
          this.$refs['hourInput'].focus();
        },
        submitHour(){
          if(this.hour % 1 === 0){
            this.hour = parseInt(this.hour);
            if(this.hour > 100 || this.hour <= 0) this.$message.error('请输入1~100的整数！');
            else {
              recordUpdate({ids:[this.id],hour:this.hour}).then((res) => {
                if(res.data.success === 0){
                  if(res.data.error.code === 3){
                    this.go();
                  }
                  else this.$message.error('更新工时数失败！');
                }
                else {
                  this.$message({
                    type:'success',
                    message:'更新时长成功'
                  });
                  this.isEdit.hourEdit = false;
                }
              })
            }
          }
          else {
            this.$message.error('工时数必须为整数！');
          }
        },
        cancelEditHour(){
          this.isEdit.hourEdit = false;
          this.hour = this.hourTmp;
        },
        editType(){
          this.typeTmp = this.type;
          this.isEdit.typeEdit = true;
        },
        submitType(){
          this.isEdit.typeEdit = false;
          recordUpdate({ids:[this.id],description:this.description}).then((res) => {
            if(res.data.success === 0){
              if(res.data.error.code === 3){
                this.go();
              }
              else this.$router.push('/error');
            }
            else {
              this.$message({
                type:'success',
                message:'更新工时内容成功'
              })
            }
          })
        },
        cancelEditType(){
          this.isEdit.typeEdit = false;
          this.type = this.typeTmp;
        },
        editDescription(){
          this.descriptionTmp = this.description;
          this.isEdit.descriptionEdit = true;
          this.$refs['descriptionInput'].focus();
        },
        submitDescription(){
          this.isEdit.descriptionEdit = false;
          recordUpdate({ids:[this.id],type:parseInt(this.type)}).then((res) => {
            if(res.data.success === 0){
              if(res.data.error.code === 3){
                this.go();
              }
              else this.$router.push('/error');
            }
            else {
              this.$message({
                type:'success',
                message:'更新工时类型成功'
              })
            }
          })
        },
        cancelEditDescription(){
          this.isEdit.descriptionEdit = false;
          this.description = this.descriptionTmp;
        },
        editReference(){
          this.referenceTmp = this.reference;
          this.isEdit.referenceEdit = true;
          this.$refs['referenceInput'].focus();
        },
        submitReference(){
          this.isEdit.referenceEdit = false;
          recordUpdate({ids:[this.id],reference:this.reference}).then((res) => {
            if(res.data.success === 0){
              if(res.data.error.code === 3){
                this.go();
              }
              else this.$router.push('/error');
            }
            else {
              this.$message({
                type:'success',
                message:'更新工时证明人成功'
              })
            }
          })
        },
        cancelEditReference(){
          this.isEdit.referenceEdit = false;
          this.reference = this.referenceTmp;
        },
      },
      mounted() {
        this.init();
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
