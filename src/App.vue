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
  import 'vue-router';

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
      signedIn: async () => {   // Promise of Boolean
        return new Promise((resolve, reject) => {
          const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            console.log(`signedIn: ${user}`);
            unsubscribe();
            resolve(user !== null);
          }, reject);
        })
      }
    }
  }
</script>
