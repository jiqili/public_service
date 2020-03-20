import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userId: null,
    password: null,
    title:null,
    // login: false
  },
  getters: {
    getUserId(state) {
      if (state.userId === null) {
        state.userId = localStorage.getItem('userId');
      }
      return state.userId;
    },
    getPassword(state) {
      if (state.password === null) {
        state.password = localStorage.getItem('password');
      }
      return state.password;
    },
    getTitle(state) {
      if (state.title === null) {
        state.title = localStorage.getItem('title');
      }
      return state.title;
    },
  },
  mutations: {
    setUserId(state, id) {
      state.userId = id;
      localStorage.setItem('userId', id);
    },
    setPassword(state, pwd) {
      state.password = pwd;
      localStorage.setItem('password', pwd);
    },
    setTitle(state, tit) {
      state.title = tit;
      localStorage.setItem('title', tit);
    },
    // setLogin(state,status) {
    //   state.login = parseInt(status);
    //   sessionStorage.setItem('login',status);
    // }
  },
  actions: {
    setUserId(context, id) {
      context.commit('setUserId', id);
    },
    setPassword(context, pwd) {
      context.commit('setPassword', pwd);
    },
    setTitle(context, tit) {
      context.commit('setTitle', tit);
    },
    // setLogin(context, status) {
    //   context.commit('setLogin', status);
    // }
  }
})
