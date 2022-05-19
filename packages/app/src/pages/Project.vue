<!--
- src/pages/Project.vue
-
- The project page. Most of the time will be spent here.
-->
<template>    <!-- Vue.js 3 still needs the wrap: "single file component must have a single 'template' element" -->
  <template v-if="project">
    <div>
      PROJECT PAGE
    </div>

    <h2>Project <span class="mono">{{ project.title }}</span></h2>

    <h3>Date: {{ project.zzz }}</h3>

    <h2>Members:</h2>
    <ul v-if="membersReady">
      <li v-for="(m,uid) in members" :key="uid">
        {{ m.name }} {{ m.isAuthor ? "is author" : "" }}
        <!-- tbd. how to form?
        <img src={{ m.photoURL }} />
        -->
      </li>
    </ul>

    <h2>Symbols:</h2>
    <div v-for="sym in symbolsSortedByLayer" :key="sym._id">
      <div>{{ sym }}</div>
    </div>
  </template>

  <template v-else-if="project === undefined">
    <div>Loading...</div>
  </template>

  <template v-else>   <!-- Project removed while working on it; should not happen -->
  </template>
</template>

<style scoped>
  * {
    text-align: center;
  }
  .mono {
    font-family: monospace
  }
</style>

<script>
  import { onUnmounted, computed, watch } from 'vue'

  import { shareMyActivity } from "/@data/wr/shareMyActivity"

  import { projectPair } from '/@data/project'
  //import { symbolsSub } from '../../data/projectSymbols'
  import {uidValidator} from "/@/user"    // DEBUG

  import { useRouter } from 'vue-router'

  /* #later
  function sortByLayer(symbols) {
    const arr = Array.from(symbols.entries(), ([id,o]) => ({ ...o, _id: id }) );    // add '_id' to all entries
    const arr2 = arr.sort( (a,b) => a.layer ?? Number.NEGATIVE_INFINITY - b.layer ?? Number.NEGATIVE_INFINITY );

    //console.log("Array of symbols (sorted): ", arr2);
    return arr2;
  }
  */

  function setup({ id, uid }) {    // 'id' is from the URL
    const router= useRouter();
    const projectId = id;

    shareMyActivity(projectId);   // also call this in certain actions (just keeping the tab open is not activity)

    console.debug("Entering project page: ", { projectId, uid });

    const [projectRef, unsub1] = projectPair(projectId);    // note: 'projectRef.value' is 'undefined' until the Firestore subscription has initialized
    //const [symbols, unsub2] = symbolsSub(projectId);

    //const symbolsSortedByLayer = computed(() => sortByLayer(symbols) );   // ReactiveReadOnly of [ {...symbolsD, _id: index } ]   // sorted by layer

    onUnmounted( () => {
      console.debug("Leaving project page: unsubscribing");
      unsub1();
      //unsub2();
    });

    //const membersReady = computed( () => Object.keys(members).length > 0 );

    // Safety guard for a case when the project simply vanishes. Should NOT happen in reality, but if does, let's log.
    //
    watch( projectRef, proj => {
      if (proj === null) {
        central/*.fatal*/ .error("Project removed while open! Leading the user to home page.");

        alert("The project is gone!!! Please continue via the home page and be in touch with app authors.");
        router.push("/");
      }
    });

    return {
      project: projectRef,
      //symbolsSortedByLayer,
      //members,
      //membersReady
    }
  }

  export default {
    name: 'Project_',
    props: {
      id: { type: String, required: true },
      uid: { type: String, required: true, validator: uidValidator }
    },
    setup
  }
</script>
