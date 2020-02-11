/*
* src/entry.js
*
* The entry point, pointed to by 'rollup.config.js'.
*
* Note: We provide access to Firebase authenticated user, but we *don't* deal with the Firebase-UI;
*     'src/pages/SignIn.vue' does.
*/
import Vue from 'vue';    // ignore IDE warning "Module is not installed" (Q: how to disable the warning in WebStorm?) #help

//Vue.config.productionTip = false  // tbd. what is?

// Initializes 'VueRouter' and creates one for us.
//
import router from './router.js';
import App from './App.vue';

/*const app =*/ new Vue({
  router,
  render: h => h(App)    // Q: what's the difference between this and 'el: ...'. Which should we use?  #vue-advice
}).$mount('#app');
