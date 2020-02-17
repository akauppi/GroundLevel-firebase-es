<!--
- src/pages/404.vue
-
- Fallback page. Good to have one in Single Page App.
-->
<template>
  <section id="here">
    <div>
      THAT PAGE DOES NOT EXIST 🗺
    </div>
  </section>
</template>

<style scoped>
  #here {
    text-align: center;
  }
</style>

<script>
  export default {
    name: 'NotFound404'      // Vue note: names help in debugging
  }
</script>
