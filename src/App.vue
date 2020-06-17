<template>
<v-app>
  <toast />

  <router-view></router-view>
</v-app>
</template>

<script>
import "@/assets/css/animate.css";


export default {
  name: 'App',
  data: () => ({
    //
  }),
};
</script>

<style>
html {
  overflow: auto !important;
}

#app {
  font-family:  'Roboto', sans-serif;
  letter-spacing: 1px;
  text-align: center;
  color: #2c3e50;
}
</style>
