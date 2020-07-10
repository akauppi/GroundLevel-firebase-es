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
      <li v-for="m in members" :key="m._id">
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
  import { onUnmounted, ref, computed } from 'vue';

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

    // Track members of the project
    //  - reflect new/left members
    //  - fetch more information about the members (changes to this info are not real time, since they change seldom and are not critical)
    //  - some added fields ('.isAuthor'), adapting the database model (UI does not need to know of the '.authors', '.collaborators').
    //
    const members = computed(() => {  // () => Array of { _id: string, isAuthor: boolean, ..userInfoC-fields }

      const arr = [...project.authors.map(uid => ({_id: uid, isAuthor: true})),
                   ...project.collaborators.map(uid => ({_id: uid, isAuthor: false}))
      ];

      // Complete with information from the 'userInfo' collection (cached).
      //
      return arr.map( o => {
        const o2 = userInfoCached(o._id);   // { ..userInfoC-fields }
        return {...o2, ...o};
      });
    });

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
