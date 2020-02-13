<!--
- src/pages/Home.vue
-
- The default page (URL /). Needs authentication.
- Signing in with mere '/signin' leads here.
-->
<template>
  <section id="here">
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
  // Let's do this via 'userProm', just to see.
  import { userProm } from '../auth.js';

  export default {
    name: 'Home',      // Vue note: names help in debugging
    data: () => ({
      name: "..."
    }),
    created() {
      userProm.then( (user) => {
        this.name = user.displayName.split(' ')[0];
      })
    }
  }
</script>
