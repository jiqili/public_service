<template>
  <div id="app">
    <router-view>

    </router-view>
  </div>
</template>

<script>
export default {
  data(){
    return{
      mainTitle:'',
    }
  }
}
</script>

<style>
  body {
  margin: 0;
  padding: 0;
  border: 0;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
  /*html.body {*/
    /*margin: 0;*/
    /*padding: 0;*/
    /*border: 0;*/
  /*}*/
</style>
