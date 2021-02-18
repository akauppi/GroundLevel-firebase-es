<!--
- src/pages/Home
-
- The default page (URL /), with a signed in user.
-->
<template>
  <div>
    YOU ARE AT HOME 🏯
  </div>

  <!-- New button + visited projects (latest first) -->
  <div class="flex-container">
    <NewTile />
    <ProjectTile v-for="[id,projectD] in projectsSorted" :key="id" :title="projectD.title" :projectId="id" />
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
    /*align-items: flex-start;*/
    padding: 10px;
  }
  .flex-container > div {
    margin: 10px;

    /* 😁 https://www.cssmatic.com/box-shadow */
    -webkit-box-shadow: 10px 10px 25px -13px rgba(0,0,0,0.5);
    -moz-box-shadow: 10px 10px 25px -13px rgba(0,0,0,0.5);
    box-shadow: 10px 10px 25px -13px rgba(0,0,0,0.5);
  }
</style>

<script>
  import { computed, onUnmounted, toRefs } from 'vue'

  import NewTile from './NewTile.vue'
  import ProjectTile from './ProjectTile/index.vue'

  import { activeProjects } from "/@data/activeProjects.js"
  //import { getCurrentUserWarm } from "/@/user"

  import { assert } from '/@/assert'

  // The UI uses projects sorted
  //
  function sort(projects) {   // (Map of <id> -> { ..projectsC doc }) => Array of [<id>, { ..projectsC doc }]; sorted by recency
    const dataRaw = Array.from( projects.entries() );   // Array of [<id>, { ..projectsC doc }]

    return dataRaw.sort( ([_,a],[__,b]) => b.created - a.created );
  }

  // Props:
  //  uid: string   Reactive value, telling the currently logged in user.
  //
  function setup(props) {     // note: object spread would lose reactivity!
    const { uid } = toRefs(props);

    // Note: Not quite sure this is the right way to code in Vue.js 3? Please advice on the lifespan of a page data. #vuejs

    let myProjects;

    console.debug("!! HOME SETUP with", { uid: uid.value });

    myProjects = activeProjects(uid.value);

    /***
    const unsub = watch( uid, (uid) => {
      assert(!myProjects);  // released by 'onUnmounted'?

      myProjects = activeProjects(uid);
    });
    ***/

    const projectsSorted = computed( () => {
      return sort(myProjects.value)    // Array of [<id>, { ..projectsC doc }]
    })

    // tbd. #style See if the '.unsub' API makes sense (should we return the 'unsub' already from 'activeProjects()'?)
    //
    onUnmounted( _ => {
      console.log("Unmounting HOME");   // DEBUG

      if (myProjects) myProjects.unsub();
      myProjects = null;

      //unsub();    // Q: should we call it?
    });

    return {
      projectsSorted
    }
  }

  export default {
    name: 'Home',
    props: {
      uid: { type: String, required: true },
    },
    components: {   // tbd. Do I still need to mention components?
      NewTile,
      ProjectTile
    },
    setup
  }
</script>
