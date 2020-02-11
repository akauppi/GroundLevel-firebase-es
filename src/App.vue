<!--
- src/App.vue
-
- The frame of the application - same for all pages
-->
<template>
  <div>
    <app-logo />
    <app-profile v-if="this.$root.signedIn" />
    <router-view />
    <app-footer />
  </div>
</template>

<style scoped>
</style>

<script>
  import AppLogo from './components/AppLogo.vue';
  import AppProfile from './components/AppProfile.vue';
  import AppFooter from './components/AppFooter.vue';
  import Vue from 'vue';

  // We need 'RouterView' to use it in the template.
  //
  const RouterView = Vue.component('router-view');

  /*
  * Promise to get the current signed in user (or none).
  *
  * Usage:
  *   'this.$root.currentUser()'
  *
  * From 'gautemo/Vue-guard-routes-with-Firebase-Authentication' 'src/firebaseinit.js'.
  */
  const currentUser = () => {    // promise of: { ... }
    return new Promise((resolve, reject) => {
      const unsubscribe = firebase.auth().onAuthStateChanged(user => {
        unsubscribe();
        resolve(user);
      }, reject);
    })
  };

  export default {
    name: 'App',     // tbd. is this needed?
    components: {
      AppLogo, AppProfile, AppFooter
    },
    // Note: We rather take the title from here than in 'public/index.html', keeping it application agnostic.
    mounted() {
      document.title = "GroundLevel with Firebase-auth"   // your title here
    },
    methods: {
      signedIn: () => {   // Promise of Boolean
        return currentUser()
            .then( user => user !== null );
      }
    }
  }
</script>
