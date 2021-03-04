<!--
- src/App/AppLogo.vue
-
- The logo in top left corner; clickable
-->
<template>
  <router-link to="/">
    <div class="fixed-top-left">
      YOUR LOGO HERE!
    </div>
  </router-link>
</template>

<style scoped>
  div {
    padding: 10px;
    background-color: orange;
    border-radius: 0 0 0.4em;
  }
</style>

<script>
  export default {
    name: 'AppLogo'
  };
</script>
