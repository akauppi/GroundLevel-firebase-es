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
  import { onUnmounted, computed, watch, reactive } from 'vue';

  import { projectSub } from '../../refs/project.js';
  import { symbolsSub } from '../../refs/projectSymbols.js';
  import { userUIinfoProm } from "../../firebase/calls";

  function setup({ id }) {    // Note: We don't need 'id' to be reactive (won't be changed while on the page)
    const projectId = id;

    console.debug("Entering project page: ", projectId);
    const [project, unsub1] = projectSub(projectId);
    const [symbols, unsub2] = symbolsSub(projectId);

    // Track members of the project
    //  - reflect new/left members
    //  - fetch more information about the members (changes to this info are not real time, since they change seldom and are not critical)
    //  - some added fields ('.isAuthor'), adapting the database model (UI does not need to know of the '.authors', '.collaborators').
    //
    // Note: Seems Vue.js (1.0.0-beta.20) doesn't work with async 'computed'. We'll use watch and imperative setting, instead.
    //
    /***
    //WHAT IF: computed async
    const membersProm = computed(async () => {  // () => Array of { _id: string, isAuthor: boolean, ..userInfoC-fields }

      const arr = [...project.authors.map(uid => ({_id: uid, isAuthor: true})),
                   ...project.collaborators.map(uid => ({_id: uid, isAuthor: false}))
      ];

      console.debug("Arr:", arr);

      // Complete with information from the 'userInfo' collection (cached).
      //
      const proms= arr.map( async o => {
        const o2 = await userUIinfo(projectId, o._id);   // { ..userInfoC-fields }
        return {...o2, ...o};
      });

      return await Promise.all(proms).then( x => { console.log(`User info of ${x._id}:`, x); return x; });
    });
    ***/

    //***WHAT IF: reactive + watch
    const members = reactive( new Map() );    // { <uid>: { ..userInfoC-fields, isAuthor: boolean } }
    const membersReady = computed( () => Object.keys(members) > 0 );

    watch( async () => {  // () => ();   sets 'members', with a potential delay (if fetching UI info is needed), when 'project.authors' or 'project.collaborators' change
      if (Object.keys(project).length == 0) return;

      const uids = [...project.authors, ...project.collaborators];
      console.debug("uids", uids);

      // Note: Set of users, and their author/collaborator status are best kept up-to-date, always. Changes to the UI
      //    specific information (name, photo) may lack behind (browser refresh will apply changes). This reduces the
      //    number of Firestore function calls.

      // Copy of the earlier contents - for the UI side caching
      const was = {...members};

      const proms = uids.map( async uid => {    // Array of Promise of [<uid>, {..userInfoC-fields, isAuthor: boolean}]

        const tmp = was.hasOwnProperty(uid) ? was[uid] : await userUIinfoProm(projectId, uid);
        return [uid, {...tmp, isAuthor: !! project.authors[uid]}];
      });

      const all = await Promise.all(proms);
      const o = Object.fromEntries(all);

      console.debug("Setting members:", o);
      Object.assign(members, o);    // replace earlier values

      members.set("ab","cd");   // BUG: nothing triggers reactivity

      console.debug("MEMBERS after setting:", members);
    });
    //***/

    watch( () => {  // DEBUG
      console.log("MEMBERS changed:", members);
    });

    const symbolsSortedByLayer = computed(() => {   // () => [ {...symbolsD, _id: index } ]   // sorted by layer

      const arr = Array.from(symbols.entries(), ([id,o]) => ({ ...o, _id: id }) );    // add '_id' to all entries
      const arr2 = arr.sort( (a,b) => a.layer ?? Number.NEGATIVE_INFINITY - b.layer ?? Number.NEGATIVE_INFINITY );

      //console.log("Array of symbols (sorted): ", arr2);
      return arr2;
    });

    onUnmounted( () => {
      console.debug("Leaving project page: unmounting Firebase subscriptions");
      unsub1();
      unsub2();
    });

    const projectReady = computed(() => Object.keys(project).length > 0);

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
