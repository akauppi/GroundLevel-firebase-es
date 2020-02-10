<!--
- src/components/AppLogo.vue
-
- The logo in top left corner.
-->
<template>
  <div class="app-logo fixed-top-left">
    YOUR LOGO HERE!
  </div>
</template>

<style scoped>
  .app-logo {
    padding: 10px;
    background-color: orange;
  }
  .fixed-top-left {
    position: fixed;
    top: 0;
    left: 0;
  }
</style>

<script>
  export default {
    name: 'AppLogo'
  };
</script>
