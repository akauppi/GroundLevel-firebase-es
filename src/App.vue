<!--
- src/App.vue
-
- The frame of the application - same for all pages
-->
<template>
  <header>
    <app-logo />
    <!-- Note: 'user' can be 'null' at first, then either an object (signed in) or 'false' (signed out).
    -->
    <app-profile v-if="user" />
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
  import { onMounted } from 'vue';

  import AppLogo from './components/AppLogo.vue';
  import AppProfile from './components/AppProfile.vue';
  import AppFooter from './components/AppFooter.vue';

  import { user } from './refs/user.js';

  export default {
    name: 'App',     // helps in debugging
    components: {
      AppLogo, AppProfile, AppFooter
    },
    setup() {
      // Note: We rather take the title from here than in 'public/index.html', keeping it application agnostic.
      onMounted(() => {
        console.log("Houston, App is mounted");
      });
      return { user }
    }
  }
</script>
