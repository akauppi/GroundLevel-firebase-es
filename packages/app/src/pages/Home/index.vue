<!--
- src/pages/Home
-
- The default page (URL /), with a signed in user.
-->
<template v-if="projectsSorted">
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
  import { computed, onMounted, onUpdated, onUnmounted } from 'vue'

  import NewTile from './NewTile.vue'
  import ProjectTile from './ProjectTile/index.vue'

  import { activeProjects } from "/@data/activeProjects"

  import { assert } from '/@tools/assert'
  import { uidValidator } from '/@/user'

  // Sort projects by creation time (for now)
  //
  function sort(projects) {   // (Map of <id> -> { ..projectsC doc }) => Array of [<id>, { ..projectsC doc }]; sorted by recency
    const dataRaw = Array.from(projects);   // Array of [<id>, { ..projectsC doc }]

    return dataRaw.sort( ([_,a],[__,b]) => b.created - a.created );
  }

  // Props:
  //  uid: string     currently logged in user
  //
  // Modeled according to: "Lifecycle Hook Registration Inside `setup`" (Vue.js docs)
  //    -> https://v3.vuejs.org/guide/composition-api-introduction.html#lifecycle-hook-registration-inside-setup
  //
  function setup({ uid }) {     // Vue note: object spread loses reactivity
    assert(uid);   // always has a signed in user on this page

    // VUE.JS 3 NOTE:
    //    "Watchers and computed properties created synchronously inside of lifecycle hooks are also automatically
    //    tor[/e/n] down when the component unmounts."
    //
    //  onBeforeMount
    //  onMounted
    //  onBeforeUpdate
    //  onUpdated
    //  onBeforeUnmount
    //  onUnmounted

    console.debug("HOME created...");

    onMounted( () => {
      console.debug("HOME MOUNTED:", { uid });
    })

    onUpdated( () => {
      console.debug("HOME UPDATED:", { uid });
    })

    onUnmounted( () => {
      console.debug("HOME UNMOUNTED");
    })

    // NOTE: Not sure, if the below needs to be within 'onMounted' tbd.
    //onMounted( () => {
      //const uid = uidRef.value;
      //assert(uid);

    console.debug("!!! Home occupied by:", uid);

    const [projectsRef, unsub] = activeProjects(uid);   // start following this user's projects

    const projectsSortedRef = computed( () => {
      const arr = Array.from(projectsRef.value);    // [<project-id>, {..projectsC doc}]
      return sort(arr);
    })

    onUnmounted( _ => {
      if (unsub) unsub();
    });

    return {
      projectsSorted: projectsSortedRef
    }
  }

  export default {
    name: 'Home',
    props: {
      uid: {
        type: String,
        required: true,
        validator: uidValidator
      }
    },
    components: {
      NewTile,
      ProjectTile
    },
    setup
  }
</script>
