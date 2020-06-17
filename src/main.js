import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

import './plugins/components';


import router from './router'

import store from './store'

import PerfectScrollbar from "vue2-perfect-scrollbar";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";



Vue.use(PerfectScrollbar);


Vue.config.productionTip = false



new Vue({
    vuetify,
    store,
    router: router,

    render: h => h(App)
}).$mount('#app')