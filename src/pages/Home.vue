<!--
- src/pages/Home.vue
-
- The default page (URL /). Needs authentication.
- Signing in with mere '/signin' leads here.
-->
<template>
  <div>
    YOU ARE AT HOME 🏯
  </div>

  <!-- Bootstrap show-off
  <div class="alert alert-success alert-dismissible fade show" role="alert">
    With Bootstrap!
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  -->

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
</template>

<style scoped>
  * {
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
  import ProjectTile from './Home/ProjectTile.vue';
  import { projects } from "../refs/projects.js";

  import { computed } from 'vue';

  // The UI uses projects sorted
  //
  const projectsSorted = computed( () => {   // array of { id: string, ..projectsC doc fields }
    const dataRaw = Array.from( projects.entries() );    // ES6 'Map'

    if (dataRaw.length > 0) { // DEBUG
      console.debug( "Projects data (still unsorted):", dataRaw);
    }

    const tmp = dataRaw.map( tuple => {    // ([id,data])
      const [id,data] = tuple;
      return { _id: id, ...data };
    });
    return tmp.sort( (a,b) => b.created - a.created );
  });

  export default {
    name: 'Home',
    components: {   // tbd. Do I still need to mention components?
      ProjectTile
    },
    setup() {
      return {
        projectsSorted
      }
    }
  }
</script>
