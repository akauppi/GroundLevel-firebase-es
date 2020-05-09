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

    <!-- New button + visited projects (latest first) -->
    <div class="flex-container">
      <ProjectTile :project="null" />
      <ProjectTile v-for="o in projectsSorted" :key="o._id" :project="o" />
    </div>

    <!-- Invited --
    <div class="flex-container">
      <ProjectTile v-for="p in invitesPending" :key="p._id" :project="p" />
    </div>
    -->
  </section>
</template>

<style scoped>
  #here {
    text-align: center;
  }

  .flex-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 10px;
  }
  .flex-container > div {
    margin: 10px;

    /* 😁 https://www.cssmatic.com/box-shadow */
    -webkit-box-shadow: 10px 10px 25px -13px rgba(0,0,0,0.5);
    -moz-box-shadow: 10px 10px 25px -13px rgba(0,0,0,0.5);
    box-shadow: 10px 10px 25px -13px rgba(0,0,0,0.5);
  }

  /* disabled (used flex instead)
  .grid-container-projects {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
    justify-items: center;

    grid-gap: 10px;
  }*/
</style>

<script>
  import { user } from '../refs/user.js';
  import ProjectTile from './Home/ProjectTile.vue';
  import { watchMyProjects } from "../firebase/queries.js";
  import { assert } from "../util/assert.js";

  import { reactive } from 'vue';

  export default {
    name: 'Home',      // Vue note: names help in debugging
    components: {
      ProjectTile
    },
    data: () => {
      return {
        projects: reactive( new Map() ),    // <project-id>: { title: string, created: datetime, lastVisited: datetime }
        unsubscribe: null    // () => ();   cleanup of Firestore watchers
      }
    },
    computed: {
      projectsSorted(vm) {   // array of { id: string, ..projectsC doc fields }
        //const dataRaw = Object.entries(vm.projects);    // from an object
        const dataRaw = Array.from( vm.projects.entries() );    // ES6 'Map'

        if (dataRaw.length > 0) { // DEBUG
          console.log( "Projects data (still unsorted):", dataRaw);
        }

        const tmp = dataRaw.map( tuple => {    // ([id,data])
          const [id,data] = tuple;
          return { _id: id, ...data };
        });
        return tmp.sort( (a,b) => b.created - a.created );
      },
      uid: (vm) => {
        return vm.user ? vm.user.uid : '...';
      },
      user: () => user
    },
    created() {
      const vm = this;
      assert(vm);

      // We get a snapshot of all the matching documents, when something changes. Update 'projects' accordingly.
      //
      vm.unsubscribe = watchMyProjects( (id, data) => {
        if (!data) {
          vm.projects.delete(id);   // ES6 'Map'
        } else {
          vm.projects.set(id, data);  // ES6 'Map'
        }
      })
    },
    beforeDestroy: function () {
      const vm = this;

      vm.unsubscribe();
    }
  }
</script>
