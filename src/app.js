
import Vue from 'vue/dist/vue.runtime.esm.js';    // works
//import Vue from 'vue';    // fails with: "Failed to resolve module specifier "vue". Relative references must start with either "/", "./", or "../"."

import App from './App.vue';

const app = new Vue({
  render: h => h(App)
});

export { app };
