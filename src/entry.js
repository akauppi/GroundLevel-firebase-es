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
Vue.use(VueRouter);       // needed before first 'new Vue(...)'

import App from './App.vue';
import router from './router.js';

new Vue({
  el: '#app',
  router,
  render: h => {
    console.log( "Rendering..." );
    return h(App)
  },

  renderError: (h, err) => {  // pour runtime problems on the screen, if we have them (may help in development);
                              // in production we may want to pour these to central monitoring
    return h('pre', { style: { color: 'red' }}, err.message)    // has 'err.stack'
  }
});
