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
  import { computed, onMounted, onUpdated, onUnmounted, toRefs, watch, ref } from 'vue'

  import NewTile from './NewTile.vue'
  import ProjectTile from './ProjectTile/index.vue'

  import { activeProjects } from "/@data/activeProjects"

  import { assert } from '/@/assert'
  import { uidValidator } from '/@/user'

  // The UI uses projects sorted
  //
  function sort(projects) {   // (Map of <id> -> { ..projectsC doc }) => Array of [<id>, { ..projectsC doc }]; sorted by recency
    const dataRaw = Array.from( projects.entries() );   // Array of [<id>, { ..projectsC doc }]

    return dataRaw.sort( ([_,a],[__,b]) => b.created - a.created );
  }

  // Props:
  //  uid: Ref of String    Reactive value, telling the currently logged in user.
  //
  // Modeled according to -> https://v3.vuejs.org/guide/composition-api-introduction.html#lifecycle-hook-registration-inside-setup
  //
  function setup(props) {     // Vue note: object spread would lose reactivity
    const { uid: /*as*/ uidRef } = toRefs(props);

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
      console.debug("HOME MOUNTED:", { uid: uidRef.value });

      assert(uidRef.value);   // always has a signed in user on this page
    })

    onUpdated( () => {
      console.debug("HOME UPDATED:", { uid: uidRef.value });

      assert(uidRef.value);
    })

    onUnmounted( () => {
      assert(uidRef.value);
      console.debug("HOME UNMOUNTED");
    })

    /*** DISABLED TEMPORARILY
    const projectsRef = ref();   // Ref of undefined | null | Ref of Map of <project-id> -> { ..Firebase project fields }

    let unsub;   // undefined | null | () => ()    ; call to stop tracking 'projectsRef.value'

    /_*const unsub2 =*_/ watch( uidRef, (uid) => {
      console.debug("!! HOME occupied by", { uid: uid });

      if (uid) {
        assert(!unsub);
        [projectsRef.value, unsub] = activeProjects(uid);
      } else {
        // 'Home' is not visible once there is no user, but the component is still up and about (or destroyed and will be recreated?)
        assert(unsub);
        unsub();
        [projectsRef.value, unsub] = [null, null];
      }
    });

    const projectsSorted = computed( () => {    // Ref of null | Array of [<uid>, { ..projectsC doc }]
      const x = projectsRef.value;
      return x ? sort(x.value) : [];   // null | Array of [<uid>, { ..projectsC doc }]
    })
    ***/
    const projectsSorted = ref();

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
        validator: uidValidator
      }
    },
    components: {   // tbd. Do I still need to mention components?
      NewTile,
      ProjectTile
    },
    setup
  }
</script>
