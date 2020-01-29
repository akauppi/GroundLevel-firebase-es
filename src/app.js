
import Vue from 'vue/dist/vue.esm.js';
//import Vue from 'vue';
//import Vue from 'x-vue-runtime';  // REMOVE

import App from './App.vue';

const app = new Vue({
  render: h => h(App)
});

export { app };
