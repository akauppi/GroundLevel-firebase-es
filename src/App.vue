<!--
- src/App.vue
-
- The frame of the application - same for all pages
-->
<template>
  <div>
    <app-logo />
    <app-profile v-if="user" />
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
  import { userMixin } from '@/mixins/user.js';   // ignore IDE warning
  import { appTitle } from './config.js';

  export default {
    name: 'App',     // helps in debugging
    components: {
      AppLogo, AppProfile, AppFooter
    },
    mixins: [userMixin],
    // Note: We rather take the title from here than in 'public/index.html', keeping it application agnostic.
    mounted() {
      console.log("Houston, App is mounted");
      document.title = appTitle;
    }
  }
</script>
