<!--
- src/pages/Home.vue
-
- The default page (URL /). Needs authentication.
- Signing in with mere '/signin' leads here.
-->
<template>
  <section>
    <app-profile />
    <div>
      YOU ARE AT HOME 🏯
    </div>

    <h2>Hi {{name}}</h2>
  </section>
</template>

<script>
  export default {
    //name: 'Home'     // tbd. is this needed?
  }
</script>

<style scoped>
</style>
