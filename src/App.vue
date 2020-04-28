<!--
- src/App.vue
-
- The frame of the application - same for all pages
-->
<template>
  <!-- tbd. Once firmly in Vue 3, remove the single-root-node 'div' -->
  <div>
    <!-- #Snip
        header-main-footer _may_ be good for accessibility. Use of them doesn't really change anything for normal
        rendering. (Q: is this correct? #advice)

        See -> https://stackoverflow.com/questions/4781077/html5-best-practices-section-header-aside-article-elements
    -->
    <header>
      <app-logo />
      <app-profile v-if="user" />
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <app-footer />
    </footer>
  </div>
</template>

<style scoped>
</style>

<script>
  import AppLogo from './components/AppLogo.vue';
  import AppProfile from './components/AppProfile.vue';
  import AppFooter from './components/AppFooter.vue';
  import { userMixin } from './mixins/user.js';
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
