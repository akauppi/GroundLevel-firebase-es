<!--
- src/pages/Project/index.vue
-
- The project page. Most of the time will be spent here.
-->
<template>
  <template v-if="project !== undefined">
    <div>
      PROJECT PAGE
    </div>

    <h2>Project <span class="mono">{{ project.title }}</span></h2>

    <h2>Members:</h2>
    <ul v-if="membersReady">
      <li v-for="(m,uid) in members" :key="uid">
        {{ m.name }} {{ m.isAuthor ? "is author" : "" }}
        <img src="{{ m.photoURL }}"/>
      </li>
    </ul>

    <h2>Symbols:</h2>
    <div v-for="sym in symbolsSortedByLayer" :key="sym._id">
      <div>{{ sym }}</div>
    </div>

  </template>
  <template v-else>
    <div>Loading...</div>
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
  import { onUnmounted, computed } from 'vue'

  import { shareMyActivity } from "/@data-wr/shareMyActivity"

  import { projectSub } from '/@data/project'
  //import { symbolsSub } from '../../data/projectSymbols'

  /* #later
  function sortByLayer(symbols) {
    const arr = Array.from(symbols.entries(), ([id,o]) => ({ ...o, _id: id }) );    // add '_id' to all entries
    const arr2 = arr.sort( (a,b) => a.layer ?? Number.NEGATIVE_INFINITY - b.layer ?? Number.NEGATIVE_INFINITY );

    //console.log("Array of symbols (sorted): ", arr2);
    return arr2;
  }
  */

  function setup({ id }) {    // Note: We don't need 'id' to be reactive (won't be changed while on the page)
    const projectId = id;

    shareMyActivity(projectId);   // also call this in certain actions (just keeping the tab open is not activity)

    console.debug("Entering project page: ", projectId);

    const projectRD = projectSub(projectId);
    //const [symbols, unsub2] = symbolsSub(projectId);

    //const symbolsSortedByLayer = computed(() => sortByLayer(symbols) );   // ReactiveReadOnly of [ {...symbolsD, _id: index } ]   // sorted by layer

    onUnmounted( () => {
      console.debug("Leaving project page: unsubscribing");
      projectRD.unsub();
      //symRD.unsub();
    });

    //const membersReady = computed( () => Object.keys(members).length > 0 );

    return {
      project: projectRD,
      //symbolsSortedByLayer,
      //members,
      //membersReady
    }
  }

  export default {
    name: 'Project',
    props: {
      id: { type: String, required: true }
    },
    setup
  }
</script>
