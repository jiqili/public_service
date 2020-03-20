import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import userManage from '@/components/usermanage'
import collageManage from '@/components/collagemanage'
import global from '@/components/global'
import Login from '@/components/Login'
import userInfo from '@/components/userInfo'
import departmentInfo from '@/components/departmentInfo'
import collageInfo from '@/components/collageInfo'
import error from '@/components/error'
import departmentManage from '@/components/departmentManage'
import recordManage from '@/components/recordManage'
import recordMutipleManage from '@/components/recordMutipleManage'
import recordQueryByLeader from '@/components/recordQueryByLeader'
import myCollageInfo from '@/components/myCollageInfo'
import myRecord from '@/components/myRecord'
import recordQueryByChief from '@/components/recordQueryByChief'
import studentInfo from '@/components/studentInfo'
import studentManage from '@/components/studentManage'
import recordInfo from '@/components/recordInfo'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import md5 from 'js-md5'

Vue.use(Router);
Vue.use(VueAxios, axios);
Vue.use(ElementUI);

axios.defaults.withCredentials = true;

Vue.prototype.$md5 = md5;

export default new Router({
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: Login,
      hidden: true,
      meta: {
        title: '登录',
      }
    },
    {
      path: '/global',
      name: 'global',
      component: global,
      hidden: true,
      meta: {
        title: 'global',
        type: ''
      }
    },
    {
      path: '/',
      name: '用户',
      component: HelloWorld,
      iconCls: 'al-iconhezuohuobanmiyueguanli',
      // iconCls:'el-icon-menu',
      meta: {
        requireAuth: true,
      },
      children: [
        {path: '/user',component: userManage,name: '用户管理',meta:{requireAuth: true}}
      ]
    },
    {
      path: '/',
      component: HelloWorld,
      name: '学院',
      iconCls: 'al-iconxueyuan',
      children: [
        {path: '/collage',component:collageManage,name:'学院管理',meta:{requireAuth: true}},
        {path: '/myCollageInfo',component:myCollageInfo,name:'我的学院',meta:{requireAuth: true}},
      ]
    },
    {
      path:'/userInfo',
      component: userInfo,
      name: '用户信息',
      hidden:true,
      meta: {
        requireAuth: true,
      }
    },
    {
      path:'/recordInfo',
      component: recordInfo,
      name: '工时记录',
      hidden:true,
      meta: {
        requireAuth: true,
      }
    },
    {
      path:'/departmentInfo',
      component: departmentInfo,
      name: '部门信息',
      hidden:true,
      meta: {
        requireAuth: true,
      }
    },
    {
      path:'/collageInfo',
      component: collageInfo,
      name: '学院信息',
      hidden:true,
      meta: {
        requireAuth: true,
      }
    },
    {
      path:'/error',
      component: error,
      name:'错误',
      hidden:true,
    },
    {
      path: '/',
      component: HelloWorld,
      name: '部门',
      iconCls: 'al-iconbumenyongneng',
      children: [
        {path: '/departmentManage',component:departmentManage,name:'部门管理',meta:{requireAuth: true}},

      ]
    },
    {
      path:'/',
      component: HelloWorld,
      name:'学生',
      iconCls: 'al-iconxueshengguanli',
      children: [
        {path: '/studentManage',component:studentManage,name:'学生管理',meta:{requireAuth: true}}
      ]
    },
    {
      path: '/',
      component: HelloWorld,
      name: '工时',
      iconCls: 'al-iconjilu',
      children: [
        {path: '/myRecord',component:myRecord,name:'我的工时',meta:{requireAuth: true}},
        {path: '/recordManage',component:recordManage,name:'工时管理',meta:{requireAuth: true}},
        {path: '/recordMutipleManage',component:recordMutipleManage,name:'工时批量管理',meta:{requireAuth: true}},
        {path: '/recordQueryByLeader',component:recordQueryByLeader,name:'学院工时管理',meta:{requireAuth: true}},
        {path: '/recordQueryByChief',component:recordQueryByChief,name:'部门工时管理',meta:{requireAuth: true}},
      ]
    },
  ]
})
