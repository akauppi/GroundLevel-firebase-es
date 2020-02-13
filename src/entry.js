/*
* src/entry.js
*
* The entry point, pointed to by 'rollup.config.js'.
*
* Note: We provide access to Firebase authenticated user, but we *don't* deal with the Firebase-UI;
*     'src/pages/SignIn.vue' does.
*/
import Vue from 'vue';    // ignore IDE warning "Module is not installed" (Q: how to disable the warning in WebStorm?) #help

import VueRouter from 'vue-router';
Vue.use(VueRouter);   // needs to be before first 'new Vue()'

//Vue.config.productionTip = false  // tbd. what is?

// Initializes 'VueRouter' and creates one for us.
//
import router from './router.js';
import App from './App.vue';

/*global app =*/ new Vue({
  el: '#app',
  router,
  render: h => h(App),    // Q: what's the difference between this and 'el: ...'. Which should we use?  #vue-advice

  renderError: (h, err) => {    // is this worth having? (we ever see it?)
    return h('pre', { style: { color: 'red' }}, err.message)    // has 'err.stack'
  }
});
