<template >
  <el-row class="container">
    <!--顶部栏-->
    <el-col :span="24" class="header">
      <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
        {{collapsed?'':sysName}}
      </el-col>
      <el-col :span="10">
        <div class="tools" @click.prevent="collapse">
          <i class="al-iconliebiaomoshi_kuai"></i>
        </div>
      </el-col>
      <el-col :span="4" class="userInfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userInfo-inner">{{sysUserName}}<img src="../assets/logo.png"/> </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="showInfo">个人信息</el-dropdown-item>
            <el-dropdown-item @click.native="g">我的TITLE</el-dropdown-item>
            <el-dropdown-item divided @click.native="logoff">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>

    <el-col :span="24" class="main">
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
        <!--导航菜单-->
        <div style="height: 100%;" >
          <el-menu  class="el-menu-vertical-demo" :class="collapsed?'logo-collapse-width':'logo-width'" @open="handleopen" @select="handleselect"
                    unique-opened router :collapse="collapsed" >
            <template v-for="(item,index) in $router.options.routes" v-if="ableShow(item)">
              <el-submenu :index="index+''">
                <template slot="title"><i :class="item.iconCls"></i></template>
                <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="ableShow2(child)">{{child.name}}</el-menu-item>
              </el-submenu>
            </template>
          </el-menu>
        </div>
        <!--<div v-if="collapsed">-->
          <!--<el-menu  class="el-menu-vertical-demo" :class="collapsed?'logo-collapse-width':'logo-width'" @open="handleopen" @select="handleselect"-->
          <!--unique-opened router :collapse="collapsed" v-if="collapsed">-->
          <!--<template v-for="(item,index) in $router.options.routes" v-if="ableShow(item)">-->
          <!--<el-submenu :index="index+''">-->
          <!--<template slot="title"><i :class="item.iconCls"></i></template>-->
          <!--<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="ableShow2(child)">{{child.name}}</el-menu-item>-->
          <!--</el-submenu>-->
          <!--</template>-->
          <!--</el-menu>-->
        <!--</div>-->


        <!--折叠后导航菜单-->
        <!--<ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">-->
          <!--<li v-for="(item,index) in $router.options.routes" v-if="ableShow(item)" class="el-submenu item">-->
            <!--<template v-if="!item.leaf">-->
              <!--<div class="el-submenu__title" style="..." @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">-->
                <!--<i :class="item.iconCls"></i>-->
              <!--</div>-->
              <!--<ul class="el-submenu" :class="'submenu-hook-'+index" @mouseout="showMenu(index,false)" @mouseover="showMenu(index,true)" >-->
                <!--<li v-for="child in item.children" v-if="ableShow2(child)" :key="child.path" class="el-menu-item" style="..." :class="$route.path==child.path?'is-active':''"-->
                    <!--@click="$router.push(child.path)">-->
                  <!--{{child.name}}-->
                <!--</li>-->
              <!--</ul>-->
            <!--</template>-->
            <!--<template v-else>-->
            <!--<ul>-->
              <!--<li class="el-submenu">-->
                <!--<div class="el-submenu__title el-menu-item" style="..." :class="$route.path==item.children[0].path?'is-active':''"-->
                     <!--@click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>-->
              <!--</li>-->
            <!--</ul>-->
            <!--</template>-->
          <!--</li>-->
        <!--</ul>-->
      </aside>
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="breadcrumb-container">
            <strong class="title">{{$route.name}}</strong>
            <el-breadcrumb separator="/" class="breadcrumb-inner">
              <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                {{item.name}}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
  import {findUser,findDepartmentById,findCollege,listColleges,findStudentById} from "@/api/api";
  import global from '@/components/global';
  export default {
  name: 'HelloWorld',
  data () {
    return {
      menuLoading:false,
      id:'',
      title:'',
      sysName: '工时管理系统',
      collapsed: false,
      sysUserName: '',
      sysUserAvatar: '',
      isValid:true,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    showMenuName(item){
      if(this.collapsed) {
        return '';
      }
      else {
        return ' '+item.name;
      }
    },
    g(){
      console.log('here5');
      this.$message(this.title);
    },
    ableShow2(child){
      if(child.hidden) return false;
      else  {
        if(this.title === '管理员'){
          return child.name === '学院管理' || child.name === '用户管理';
        }
        else if(this.title === '工时管理员'){
          return child.name === '工时管理' || child.name === '工时批量管理' || child.name === '学生管理' || child.name === '我的学院';
        }
        else if(this.title === '指导老师'){
          return child.name === '我的学院' || child.name === '学院工时管理' || child.name === '学生管理';
        }
        else if(this.title === '队长'){
          return child.name === '我的学院' || child.name === '学院工时管理' || child.name === '学生管理' || child.name === '我的工时';
        }
        else if(this.title === '部长'){
          return child.name === '我的工时' || child.name === '部门管理' || child.name === '部门工时管理';
        }
        else if(this.title === '普通学生'){
          return child.name === '我的工时';
        }
      }
    },
    ableShow(item){
      if(item.hidden || !this.isValid ) return false;
      else  {
        if(this.title === '管理员'){
          return item.name === '用户' || item.name === '学院';
        }
        else if(this.title === '工时管理员'){
          return item.name === '学院' || item.name === '工时' || item.name === '学生';
        }
        else if(this.title === '指导老师' || this.title === '队长'){
          return item.name === '学院' || item.name === '工时' || item.name === '学生';
        }
        else if(this.title === '部长'){
          return item.name === '工时' || item.name === '部门';
        }
        else if(this.title === '普通学生'){
          return item.name === '工时';
        }
      }
    },
    showInfo() {
      this.$router.push({path:'/userInfo',query: {userId: this.id}});
    },
    //折叠导航栏
    collapse:function(){
      this.collapsed=!this.collapsed;
      setTimeout(500);
    },
    logoff(){
      this.axios.post('http://localhost:8080/public_service/user/logoff').then((res) => {
        console.log(res.data);
        this.res = res.data;
        this.$store.dispatch('setUserId', null);
        this.$store.dispatch('setPassword', null);
        this.$store.dispatch('setTitle',null);
        this.$router.go(0);
      }, (err) => {
        console.log(err);
      });
    },
    showMenu(i,status){
      this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
    },
    onSubmit(){
      console.log('submit');
    },
    handleopen(){
      console.log('handleopen');
    },
    handleclose(){
      console.log('handleclose');
    },
    handleselect: function (a,b){

    },
    reLogin() {
      let para = {id:this.$store.getters.getUserId,password:this.$store.getters.getPassword};
      para.id = parseInt(para.id.toString());
      return this.axios.post(`http://localhost:8080/public_service/user/login`,para);
    },
    f(res) {
      this.sysUserName=res.data.result.name;
      let tmp = res.data.result;
      if(tmp.permission === -1) {
        this.title = '管理员';
        this.$store.dispatch('setTitle',this.title);
      }
      else if(tmp.permission === global.recordManager) {
        this.title = '工时管理员';
        this.$store.dispatch('setTitle',this.title);
        if(res.data.result.cname === null) this.isValid = false;
      }
      else {
        findStudentById({id:this.id}).then((res2) => {
          if(res2.data.success === 0 && res2.data.error.code === 14){
            this.title = '指导老师';
            this.$store.dispatch('setTitle',this.title);
            if(res.data.result.cname2 === null) this.isValid = false;
          }
          else if(res2.data.success === 1){
            findCollege({id:res2.data.result.cid}).then((res3) => {
              console.log(res3.data);
              if(res3.data.result.college !== undefined){
                if(res3.data.result.college.sid === this.id){
                  this.title = '队长';
                  this.$store.dispatch('setTitle',this.title);
                }
              }
              else {
                if(res3.data.result.sid === this.id){
                  this.title = '队长';
                  this.$store.dispatch('setTitle',this.title);
                }
              }
              if(this.title === ''){
                findDepartmentById({id:res2.data.result.did}).then((res4) => {
                  console.log(res4.data);
                  if(res4.data.result.sid === this.id){
                    this.title = '部长';
                    this.$store.dispatch('setTitle',this.title);
                  }
                  if(this.title === '') {
                    this.title = '普通学生';
                    this.$store.dispatch('setTitle',this.title);
                  }
                })
              }
            });
          }
          else {
            this.$router.push('/error');
          }
        });
      }
    }
  },
  mounted(){
    let para ={id:this.$store.getters.getUserId};
    para.id = parseInt(para.id.toString());
    this.id = para.id;
    findUser(para).then((res)=>{
        if(res.data.success === 0 && res.data.error.code === 3){
          this.reLogin().then(() => { findUser({id: para.id}).then(res1 => {
            if (res1.data.success === 0) {
              this.$router.push('/error');
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
    }
}
</script>

<style scoped>
  .container {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }
  .header {
    height: 60px;
    line-height: 60px;
    background: #20a0ff;
    color: #fff;
  }
  .userInfo {
    text-align: right;
    padding-right: 35px;
    float: right;
  }
  .userInfo-inner {
    cursor: pointer;
    color: #fff;
  }
  .userInfo-inner img {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin: 10px 0 10px 10px;
    float: right;
  }
  .logo {
    height:60px;
    font-size: 22px;
    padding-left:30px;
    padding-right:30px;
    border-color: rgba(238,241,146,0.3);
    border-right-width: 1px;
    border-right-style: solid;
  }
  .logo img {
    width: 40px;
    float: left;
    margin: 10px 10px 10px 18px;
  }
  .logo-width {
    width: 230px;
    height: 100%;
  }
  .logo-collapse-width {
    width: 60px;
    height: 100%;
  }
  .tools{
    padding: 0px 23px;
    width:14px;
    height: 60px;
    line-height: 60px;
    cursor: pointer;
      }
  .main {
      display: flex;
      position: absolute;
      top: 60px;
      bottom: 60px;
      overflow: hidden;
    }
  aside {
    flex: 0 0 230px;
    width: 230px;
  }
  aside.el-menu {
    height: 100%;
  }
  aside.collapsed {
    width: 60px;
  }
  aside.item{
    position: relative;
  }
  aside.submenu{
    position: absolute;
    top: 0;
    left: 60px;
    z-index: 9999;
    height: auto;
    display: none;
  }
  .menu-collapsed{
    flex: 0 0 60px;
    width: 60px;
  }
  .menu-expanded{
    flex: 0 0 230px;
    width: 230px !important;
  }
  .content-container {
    flex: 1;
    overflow-y: scroll;
    padding: 20px;
  }
  .breadcrumb-container-title{
    width: 200px;
    float: left;
    color: #475669;
  }
  .breadcrumb-inner{
    float: right;
  }
  .content-wrapper{
    background-color: #fff;
    box-sizing:border-box;
  }
</style>
