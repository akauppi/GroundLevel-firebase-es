<!--
- src/App.vue
-
- The frame of the application - same for all pages
-->
<template>
  <div>
    <!-- tbd. IDE warnings "unknown HTML tag" - how to remove those? #help -->
    <app-logo />
    <app-profile />   <!-- tbd. hide when not signed in -->
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

  export default {
    components: {
      AppLogo, AppProfile, AppFooter
    },
    // Note: We rather take the title from here than in 'public/index.html', keeping it application agnostic.
    mounted() {
      document.title = "GroundLevel with Firebase-auth"   // your title here
    },
  }
</script>
