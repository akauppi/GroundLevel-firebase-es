<!--
- src/pages/Home/ProjectTile/index.vue
-
- The button to open an existing project.
-
- Props:
-   project: { _id: string, ..projectsC document fields }
-->
<template>
  <!-- Using slot with 'router-link'
  -     -> https://next.router.vuejs.org/guide/migration/#removal-of-event-and-tag-props-in-router-link
  -->
  <router-link v-bind:to="`/projects/${projectId}`"
               custom
               v-slot="{ navigate }"
  >
    <div @click="navigate" role="link" class="project-tile">
      <div class="title">{{ title }}</div>

      <!-- users having access to the project; except the current user
      -->
      <MemberFace v-for="[uid,o] in membersNotMeSorted"
                  :key="uid"
                  :user="o"
      />
    </div>
  </router-link>
</template>

<style scoped>
  @import '../shared.css';

  .project-tile .title {
    font-weight: bold;
    margin-bottom: 1.5em;
  }

  /* 'role=link' is accessibility stuff. We use it for providing the mouse hand. */
  [role="link"]:hover {
    cursor: pointer;
  }
</style>

<script>
  import { assert } from '/@tools/assert'
  import { computed, onUnmounted } from 'vue'
  import MemberFace from './MemberFace.vue'

  import { memberUserInfos_notMe } from '/@data/memberUserInfos_notMe'

  const statusOrder = new Map([
    ["live", 0],
    ["recent", 1],
    ["", 99]
  ]);

  /*
  * Sort the project user infos, using '.state' and maybe '.displayName'. The idea is to have most recent ones first
  * but so that the overall sort order also remains stable.
  *
  * Incoming: Map of <uid> -> { photoURL: string, displayName: string, status: "live"|"recent"|"" }
  *
  * Outgoing Array (sorted) of: { uid: string, photoURL: string, displayName: string, status: ... }
  */
  function sort(m) {    // Map of <uid> -> { ..projectUserInfoC doc, status: enum } => Array of [<uid>, { ..projectUserInfoC doc }]

    const arr = Array.from( m.entries() );

    return arr.sort( ([_,a],[__,b]) => {
      const x = statusOrder[b.status] - statusOrder[a.status];
      if (x != 0) { // grouping decides
        return x;
      } else {    // inside grouping
        return a.displayName.localeCompare( b.displayName )   // stable outcome matters; can lowercase if needed
      }
    })
  }

  // tbd. is the claim about 'projectId' lifespan valid?  (change projects; test...)

  function setup({ projectId }) {   // 'projectId' stays same within the component's lifespan; can use destructuring
    assert(projectId);

    // tbd. Likely this code needs to go in 'onMounted'
    const [refMap, unsub] = memberUserInfos_notMe(projectId);   // [Ref of Map of <uid> -> { displayName: string, photoURL: string, status: "live"|"recent"|... }, () => ()]

    onUnmounted( unsub );

    return {
      membersNotMeSorted: computed( () => sort(refMap.value) )   // Array of [<uid>, { displayName: string, photoURL: string, status: ... }]
        //
        // ^-- Note: No need to name '...Ref' since only used in HTML template.
    }
  }

  export default {
    name: 'ProjectTile',
    components: {
      MemberFace
    },
    props: {    // tbd. prop likely doesn't work like this, does it? #check
      projectId: { type: String, required: true },

      // Note: Better to take just the pieces we need (in the UI), not the whole 'projectD' object.
      title: { type: String, required: true }
    },
    setup
  };
</script>
