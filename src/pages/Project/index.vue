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
      <!-- Note: Does the 'userInfo[uid].name' work reactively, even when 'userInfo' doesn't yet have the info but will? #vuejs
      -->
      <li v-for="uid in [...project.authors, ...project.collaborators]" :key="uid">
        {{ userInfo[uid] ? userInfo[uid].name : "💫" }} {{ uid in project.authors ? "is author" : "" }}
      </li>
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
  import { onUnmounted, ref, toRefs } from 'vue';

  import { projectSub } from '../../refs/project.js';

  const userInfoFAKE = {
    '7wo7MczY0mStZXHQIKnKMuh1V3Y2': {
      name: "asko"
    }
  }

  // Note: We don't need 'id' to be reactive (won't be changed while on the page)
  //
  function setup({ id }) {
    console.debug("Entering project page: subscribing to project:", id);

    const [project, unsub] = projectSub(id);

    onUnmounted( () => {
      console.debug("Leaving project page: unmounting Firebase subscriptions");
      unsub();
    });

    return {
      project,
      //symbols,
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
