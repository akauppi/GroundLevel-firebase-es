<!--
- src/components/AppLogo.vue
-
- The logo in top left corner
-->
<template>
  <div class="absolute-top-left">
    YOUR LOGO HERE!
  </div>
</template>

<style scoped>
  div {
    padding: 10px;
    background-color: orange;
  }
  .absolute-top-left {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>

<script>
  export default {
    name: 'AppLogo'
  };
</script>
