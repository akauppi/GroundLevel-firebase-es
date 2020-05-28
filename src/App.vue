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

        assert(firebase);

        // Check Firebase health
        try {
          const app = firebase.app();
          const features = ['auth'].filter(feature => typeof app[feature] === 'function');
          console.log(`Firebase SDK loaded with: ${features.join(', ')}`);
        } catch (e) {
          // tbd. we might have some error banner UI, later
          console.error(e);
          alert('Error loading the Firebase SDK, check the console.');
        }
      });
      return { user }
    }
  }
</script>
