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

    <!-- DEBUG
    <div>Projects: {{ projectsSorted.length }}</div>
    -->
    <!-- List the projects we have access to -->
    <div id="grid-container-projects">
      <ProjectTile :project="null" />
      <ProjectTile v-for="p in projectsSorted" :key="p.key" :project="p" />
    </div>
  </section>
</template>

<style scoped>
  #here {
    text-align: center;
  }

  /* tbd. could do some aesthetic grouping: to make the columns grow by the width of the browser window;
  * to have possibly padding to left and right if there's plentiful space.
  */
  #grid-container-projects {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
    justify-items: center;

    grid-gap: 10px;
  }
</style>

<script>
  import { userMixin } from '/@/mixins/user';   // ignore IDE warning
  import ProjectTile from '/@/components/ProjectTile.vue';
  import { watchMyProjects } from "/@/firebase/queries";
  import { assert } from "/@/util/assert";

  export default {
    name: 'Home',      // Vue note: names help in debugging
    components: {
      ProjectTile
    },
    mixins: [userMixin],
    data: () => {
      return {
        // Vue 2 note: need to use object ('{}'), not an ES6 map to get reactivity going. With Vue 3, check if we can use a 'Map'.
        projects: {} /*new Map()*/,    // <project-id>: { title: string, created: datetime, lastVisited: datetime }
        unsubscribe: null    // () => ();   cleanup of Firestore watchers
      }
    },
    computed: {
      projectsSorted: (vm) => {   // array of { id: string, title: string, created: datetime, lastVisited: datetime }
        const dataRaw = Object.entries(vm.projects);    // from an object
        //const dataRaw = Array.from( vm.projects.entries() );    // ES6 'Map'

        if (dataRaw.length > 0) { // DEBUG
          console.log( "Projects data (still unsorted:", dataRaw);
        }

        const tmp = dataRaw.map( tuple => {    // ([id,data])
          const [id,data] = tuple;
          return { ...data, key: id };   // key injected to help Vue know which project is which
        });
        return tmp.sort( (a,b) => b.created - a.created );
      },
      uid: (vm) => {
        return vm.user ? vm.user.uid : '...';
      }
    },
    created: function () {
      const vm = this;
      assert(vm);

      // We get a snapshot of all the matching documents, when something changes. Update 'projects' accordingly.
      //
      vm.unsubscribe = watchMyProjects( (id, data) => {
        if (!data) {
          //vm.projects.delete(id);   // ES6 'Map'
          vm.$delete(vm.projects, id);
        } else {
          //vm.projects.set(id, data);  // ES6 'Map'
          vm.$set(vm.projects, id, data);
        }

        console.log( `GOT PROJECT ${id}:`, data );
      })
    },
    beforeDestroy: function () {
      const vm = this;

      vm.unsubscribe();
    }
  }
</script>
