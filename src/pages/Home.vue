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

    <h2>Hi <tt>{{ uuid }}</tt></h2>

    <!-- List the projects we have access to -->
    <template v-if="projects.length">
      <ul>
        <li v-for="p in projects" :key="p.uid">{{ p.title }}</li>
      </ul>
    </template>
  </section>
</template>

<style scoped>
  #here {
    text-align: center;
  }
</style>

<script>
  import { userMixin } from '@/mixins/user.js';   // ignore IDE warning
  //import { assert } from '@/util/assert.js';
  //REMOVE:
  //import { store } from '@/state.js';

  import { myProjectsMixin } from "@/mixins/myProjects.js";

  export default {
    name: 'Home',      // Vue note: names help in debugging
    mixins: [userMixin, myProjectsMixin],
    computed: {
      uuid: (vm) => {
        return vm.user ? vm.user.uid : '...';
      }
    }
  }
</script>
