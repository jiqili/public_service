// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/icon/iconfont.css'
import Vuex from 'vuex'
import store from './vuex/store'
// import 'font-awesome/css/font-awesome.css';
Vue.use(Vuex);
Vue.config.productionTip = false;
const whiteList = ['/','/Login'];
router.beforeEach((to,from,next)=>{
  if(to.meta.requireAuth)  {
    if(store.getters.getUserId!=="null") {
      next();
    }
    else {
      next({
        path: '/Login',
        query: {redirect: to.fullPath}
      })
    }
  }
  else {
    next();
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
});
