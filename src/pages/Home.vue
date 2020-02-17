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

    <h2>Hi {{ firstName }}</h2>
  </section>
</template>

<style scoped>
  #here {
    text-align: center;
  }
</style>

<script>
  import { userMixin } from '@/mixins/user.js';   // ignore IDE warning
  import { assert } from '@/utils/assert.js';

  export default {
    name: 'Home',      // Vue note: names help in debugging
    mixins: [userMixin],
    computed: {
      firstName: (vm) => {
        return vm.user ? vm.user.displayName.split(' ')[0] : '...';
      }
    },

    mounted(vm) {
      //console.log("At home, with: ", vm.user ? ""+ vm.user.displayName : "(unsigned)" )
    }
  }
</script>
