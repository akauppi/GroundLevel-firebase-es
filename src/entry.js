/*
* src/entry.js
*
* The entry point, pointed to by 'rollup.config.js'.
*
* Note: We provide access to Firebase authenticated user, but we *don't* deal with the Firebase-UI;
*     'src/pages/SignIn.vue' does.
*/
import Vue from 'vue';    // ignore IDE warning "Module is not installed" (Q: how to disable the warning in WebStorm?) #help
import App from './App.vue';

import router from './router.js';

//Vue.config.productionTip = false  // tbd. what is?

function checkFirebaseHealth() {
  document.addEventListener('DOMContentLoaded', () => {   // Q: does this fire just once, or multiple times?
    try {
      const app = firebase.app();
      const features = ['auth'].filter(feature => typeof app[feature] === 'function');
      console.log(`Firebase SDK loaded with: ${features.join(', ')}`);
    } catch (e) {
      console.error(e);
      alert('Error loading the Firebase SDK, check the console.');
    }
  });
}

/*const app =*/ new Vue({
  router,
  /*
  data: {
    signedIn: null    // Boolean, once Firebase UI sets it      // tbd. how to make this read-only to others? #vue-advice
  },
  */
  mounted () {
    checkFirebaseHealth()
  },
  methods: {
    /*
    * Promise to get the current signed in user (or none).
    *
    * Usage:
    *   'this.$root.currentUser()'
    *
    * From 'gautemo/Vue-guard-routes-with-Firebase-Authentication' 'src/firebaseinit.js'.
    */
    currentUser: () => {
      return new Promise((resolve, reject) => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
          unsubscribe();
          resolve(user);
        }, reject);
      })
    }
  },

  render: h => h(App)    // Q: what's the difference between this and 'el: ...'. Which should we use?  #vue-advice
}).$mount('app');

