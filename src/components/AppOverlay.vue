<!--
- src/components/AppOverlay.vue
-
- Gathers the different overlay parts, and positions them on the browser.
-->
<template>
  <div>
    <AppLogo class="fixed-top-left" />
    <AppProfile class="fixed-top-right" />
    <AppFooter class="fixed-bottom-line" />
  </div>
</template>

<style>
    .fixed-top-left {
        position: fixed;
        top: 0;
        left: 0;
        border: 3px solid #73AD21;
    }
    .fixed-top-right {
        position: fixed;
        top: 0;
        right: 0;
        border: 3px solid #73AD21;
    }
    .fixed-bottom-line {
        position: fixed;
        bottom: 0;
        width: 100%;
        border: 3px solid #73AD21;
    }
</style>

<script>
  import AppLogo from './AppLogo.vue';
  import AppProfile from './AppProfile.vue';
  import AppFooter from './AppFooter.vue';

  export default {
    name: 'AppOverlay',
    components: [ AppLogo, AppProfile, AppFooter ]
  };
</script>
