<!--
- src/App.vue
-
- The frame of the application - same for all pages
-->
<template>
  <header>
    <app-logo />
    <app-profile v-if="user.value" />
  </header>
  <main>
    <router-view />
  </main>
  <footer>
    <app-footer />
  </footer>
</template>

<style scoped>
</style>

<script>
  import AppLogo from './components/AppLogo.vue';
  import AppProfile from './components/AppProfile.vue';
  import AppFooter from './components/AppFooter.vue';
  import { user } from './refs/user.js';
  import { appTitle } from './config.js';

  export default {
    name: 'App',     // helps in debugging
    components: {
      AppLogo, AppProfile, AppFooter
    },
    computed: {
      user: () => user
    },
    // Note: We rather take the title from here than in 'public/index.html', keeping it application agnostic.
    mounted() {
      console.log("Houston, App is mounted");
      document.title = appTitle;
    }
  }
</script>
