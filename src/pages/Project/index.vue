<!--
- src/pages/Project/index.vue
-
- The project page. Most of the time will be spent here.
-->
<template>
  <template v-if="!!project">
    <div>
      PROJECT PAGE
    </div>

    <h2>Project <span class="mono">{{ project.title }}</span></h2>

    <h2>Members:</h2>
    <ul>
      <!-- Note: Does the 'userInfo[uid].name' work reactively, even when 'userInfo' doesn't yet have the info but will? #vuejs? #vuejs
      -->
      <li v-for="uid in [...project.authors, ...project.collaborators]" :key="uid">{{ uid in userInfo ? userInfo[uid].name : "💫" }} {{ uid in project.authors ? "is author" : "" }}</li>
    </ul>
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
  import { onBeforeUnmount, ref, toRefs } from 'vue';

  import { projectSub } from './projectSub.js';

  // Note: We don't need 'id' to be reactive (won't be changed while on the page) <-- is this correct?
  //
  function setup({ id }) {
    // Vue.js 3 note: refs/reactive within a 'setup' function are cleaned up by the system, but is there a way
    //    for us to tap to that? (i.e. not needing 'unsubProject')

    const [project, unsubProject] = projectSub(id);

    onBeforeUnmount( () => {
      console.debug("Leaving project page: unmounting Firebase subscriptions")
      unsubProject();
    });

    return {
      project //,
      //symbols,
      //userInfo
    }
  }

  export default {
    name: 'Project',      // Vue note: names help in debugging
    props: {
      id: {
        type: String,
        required: true
      }
    },
    setup
  }
</script>
