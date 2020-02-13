<!--
- src/pages/Home.vue
-
- The default page (URL /). Needs authentication.
- Signing in with mere '/signin' leads here.
-->
<template>
  <section id="here">
    <app-profile />
    <div>
      YOU ARE AT HOME 🏯
    </div>

    <h2>Hi {{name}}</h2>
  </section>
</template>

<style scoped>
  #here {
    text-align: center;
  }
</style>

<script>
  export default {
    //name: 'Home'     // tbd. is this needed?
  }
</script>
