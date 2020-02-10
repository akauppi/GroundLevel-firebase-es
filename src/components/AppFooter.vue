<!--
- src/components/AppFooter.vue
-
- Line at the bottom of the application.
-
- Signed in: can show status or something
- Signed out: (not used)
-->
<template>
  <div class="app-footer fixed-bottom">
    Copyright 2020
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
  //name: 'AppFooter'
};
</script>
