<!--
- src/components/AppOverlay.vue
-
- Gathers the different overlay parts, and positions them on the browser.
-->
<template>
  <div class="app-overlay">
    <app-logo class="fixed-top-left" />
    <!-- only show if signed in -->
    <app-profile class="fixed-top-right" />
    <app-footer class="fixed-bottom-line" />
  </div>
</template>

<style>
    .fixed-top-left {
        position: fixed;
        top: 0;
        left: 0;
    }
    .fixed-top-right {
        position: fixed;
        top: 0;
        right: 0;
    }
    .fixed-bottom-line {
        position: fixed;
        bottom: 0;
        width: 100%;
    }
</style>

<script>
  import AppLogo from './AppLogo.vue';
  import AppProfile from './AppProfile.vue';
  import AppFooter from './AppFooter.vue';

  export default {
    //name: 'AppOverlay',
    components: { AppLogo, AppProfile, AppFooter }
  };
</script>
