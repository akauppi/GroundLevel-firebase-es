<!--
- src/App.vue
-
- The frame of the application - same for all pages
-->
<template>
  <div>
    <app-logo />
    <app-profile v-if="isSignedIn" />
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

  import { userProm } from './auth.js';

  export default {
    name: 'App',     // tbd. is this needed?
    components: {
      AppLogo, AppProfile, AppFooter
    },
    data: () => ({
      isSignedIn: false    // at first, we're not authenticated. Later, the user may not be signed in.
    }),
    // Note: We rather take the title from here than in 'public/index.html', keeping it application agnostic.
    mounted() {
      document.title = "GroundLevel with Firebase-auth"   // your title here
    },
    created() {
      userProm.then( (user) => {
        this.isSignedIn = user !== null;
      })
    }
  }
</script>
