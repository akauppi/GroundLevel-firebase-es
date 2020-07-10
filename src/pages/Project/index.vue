<!--
- src/pages/Project/index.vue
-
- The project page. Most of the time will be spent here.
-->
<template>
  <template v-if="project">
    <div>
      PROJECT PAGE
    </div>

    <h2>Project <span class="mono">{{ project.title }}</span></h2>

    <h2>Members:</h2>
    <ul v-if="userInfo">
      <li v-for="uid in [...project.authors, ...project.collaborators]" :key="uid">
        {{ userInfo[uid] ? userInfo[uid].name : "💫" }} {{ uid in project.authors ? "is author" : "" }}
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
  import { onUnmounted, ref, computed, toRaw, watch } from 'vue';

  import { projectSub } from '../../refs/project.js';
  import { symbolsSub } from '../../refs/projectSymbols.js';

  const userInfoFAKE = ref({
    '7wo7MczY0mStZXHQIKnKMuh1V3Y2': {
      name: "asko"
    }
  });

  function setup({ id }) {    // Note: We don't need 'id' to be reactive (won't be changed while on the page)
    console.debug("Entering project page: ", id);
    const [project, unsub1] = projectSub(id);
    const [symbols, unsub2] = symbolsSub(id);

    const symbolsSortedByLayer = computed(() => {   // () => [ {...symbolsD, _id: index } ]   // sorted by layer

      const arr = Array.from(symbols.entries(), ([id,o]) => ({ ...o, _id: id }) );    // add '_id' to all entries
      const arr2 = arr.sort( (a,b) => a.layer ?? Number.NEGATIVE_INFINITY - b.layer ?? Number.NEGATIVE_INFINITY );

      console.log("Array of symbols (sorted): ", arr2);
      return arr2;
    });

    onUnmounted( () => {
      console.debug("Leaving project page: unmounting Firebase subscriptions");
      unsub1();
      unsub2();
    });

    return {
      project,
      symbolsSortedByLayer,
      userInfo: userInfoFAKE
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
