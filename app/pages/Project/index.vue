<!--
- src/pages/Project/index.vue
-
- The project page. Most of the time will be spent here.
-->
<template>
  <template v-if="projectReady">
    <div>
      PROJECT PAGE
    </div>

    <h2>Project <span class="mono">{{ project.title }}</span></h2>

    <h2>Members:</h2>
    <ul v-if="membersReady">
      <li v-for="(m,uid) in members" :key="uid">
        {{ m.name }} {{ m.isAuthor ? "is author" : "" }}
        <!-- breaks 'vite build'
        <img src="{{ m.photoURL }}"/>
        -->
      </li>
    </ul>

    <h2>Symbols:</h2>
    <div v-for="sym in symbolsSortedByLayer" :key="sym._id">
      <div>{{ sym }}</div>
    </div>
  </template>
  <template v-else>
    Loading...
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

  import { projectSub } from '../../rves/project'
  import { symbolsSub } from '../../refs/projectSymbols'
  import { membersGen } from '../../refs/projectMembers'

  function setup({ id }) {    // Note: We don't need 'id' to be reactive (won't be changed while on the page)
    const projectId = id;

    console.debug("Entering project page: ", projectId);
    const [project, unsub1] = projectSub(projectId);
    const [symbols, unsub2] = symbolsSub(projectId);

    function unsub() {
      unsub1(); unsub2();
    }

    const members = membersGen(projectId, project);

    const symbolsSortedByLayer = computed(() => {   // () => [ {...symbolsD, _id: index } ]   // sorted by layer

      const arr = Array.from(symbols.entries(), ([id,o]) => ({ ...o, _id: id }) );    // add '_id' to all entries
      const arr2 = arr.sort( (a,b) => a.layer ?? Number.NEGATIVE_INFINITY - b.layer ?? Number.NEGATIVE_INFINITY );

      //console.log("Array of symbols (sorted): ", arr2);
      return arr2;
    });

    onUnmounted( () => {
      console.debug("Leaving project page: unmounting Firebase subscriptions");
      unsub();
    });

    const projectReady = computed( () => Object.keys(project).length > 0 );
    const membersReady = computed( () => Object.keys(members).length > 0 );

    return {
      project,
      projectReady,
      symbolsSortedByLayer,
      members,
      membersReady
    }
  }

  export default {
    name: 'Project',      // Vue note: names help in debugging
    props: {
      id: { type: String, required: true }
    },
    setup
  }
</script>
