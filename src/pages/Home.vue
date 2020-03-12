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

    <h2>Hi <tt>{{ uid }}</tt></h2>

    <div>Projects: {{ projectsLatestFirst.length }}</div>
    <!-- List the projects we have access to -->
    <div id="grid-container-projects">
      <ProjectTile :project="null" />
      <ProjectTile v-for="p in projectsLatestFirst" :key="p.uid" :project="p" />
    </div>
  </section>
</template>

<style scoped>
  #here {
    text-align: center;
  }

  #grid-container-projects {
    display: grid;
  }
</style>

<script>
  import { userMixin } from '@/mixins/user';   // ignore IDE warning
  import ProjectTile from '@/components/ProjectTile.vue';
  //import { myProjectsMixin } from '@/mixins/myProjects';
  import { watchMyProjects } from "@/queries";
  import { assert } from "@/util/assert";

  export default {
    name: 'Home',      // Vue note: names help in debugging
    data: () => {
      return {
        projectsLatestFirst: []
      }
    },
    components: {
      ProjectTile
    },
    mixins: [userMixin /*, myProjectsMixin*/],
    computed: {
      uid: (vm) => {
        return vm.user ? vm.user.uid : '...';
      }
    },
    created: function () {
      const vm = this;
      assert(vm);

      watchMyProjects( (doc) => {
        console.log("!!! GOT A PROJECT:", doc);   // tbd. add or update 'projectsLatestFirst'
      })

    }
  }
</script>
