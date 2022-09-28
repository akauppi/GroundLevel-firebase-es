<!--
- src/App/AppFooter.vue
-
- Line at the bottom of the application.
-->
<template>
  <div class="app-footer fixed-bottom">
    Copyright 2022
  </div>
</template>

<style scoped>
  .app-footer {
    padding: 10px;
    text-align: center;
    width: 100%;
  }

  .fixed-bottom {
    position: fixed;
    bottom: 0;
  }
</style>

<script>
export default {
  name: 'AppFooter'
};
</script>
