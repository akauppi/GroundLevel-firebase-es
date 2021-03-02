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
  import { computed, /*onMounted, onUnmounted,*/ toRefs, watch, ref } from 'vue'

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
  //  uid: Ref of String    Reactive value, telling the currently logged in user.
  //
  function setup(props) {     // Vue note: object spread would lose reactivity
    const { uid: /*as*/ uidRef } = toRefs(props);

    console.debug("!! HOME CREATED!");

    const myProjectsRef = ref();   // Ref of undefined | null | Ref of Map of <project-id> -> { ..Firebase project fields }

    let unsub;   // undefined | null | () => ()    ; call to stop tracking 'myProjects.value'

    /*const unsub2 =*/ watch( uidRef, (uid) => {
      console.debug("!! HOME occupied by", { uid: uid });

      if (uid) {
        assert(!unsub);
        [myProjectsRef.value, unsub] = activeProjects(uid);
      } else {
        // 'Home' is not visible once there is no user, but the component is still up and about (or destroyed and will be recreated?)
        assert(unsub);
        unsub();
        [myProjectsRef.value, unsub] = [null, null];
      }
    });

    const projectsSorted = computed( () => {    // Ref of null | Array of [<uid>, { ..projectsC doc }]
      const x = myProjectsRef.value;
      return x ? sort(x.value) : [];   // null | Array of [<uid>, { ..projectsC doc }]
    })

    return {
      projectsSorted
    }
  }

  export default {
    name: 'Home',
    props: {
      uid: {
        type: String,
        required: true,
        validator: (v) => v.match(/[a-zA-Z0-9]+/)    // e.g. "dev", "7wo7MczY0mStZXHQIKnKMuh1V3Y2"
      }
    },
    components: {   // tbd. Do I still need to mention components?
      NewTile,
      ProjectTile
    },
    setup
  }
</script>
