<!--
- src/pages/Project/index.vue
-
- The project page. Most of the time will be spent here.
-->
<template>
  <section>
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
  </section>
</template>

<style scoped>
  section {
    text-align: center;
  }
  .mono {
    font-family: monospace
  }
</style>

<script>
  import { onBeforeUnmount } from 'vue';

  import { projectSub } from './projectSub.js';

  let unsubProject = null;    // () => ()

  export default {
    name: 'Project',      // Vue note: names help in debugging
    props: {
      id: { type: String, required: true }
    },
    setup: (props) => {

      onBeforeUnmount( () => {
        console.debug("Leaving project page: unmounting Firebase subscriptions")
        unsubProject();
      });

      // Vue note: for 'props' to work dynamically, returning a generator is needed. (initial comment; edit when understand it better!)
      //
      return () => {
        console.debug(`New Project props: ${props.id}`);  // TEMP
        const { id } = props;

        let project;
        [project, unsubProject] = projectSub(id);

        return {
          project //,
          //symbols,    // tbd.
          //userInfo: {}  // tbd.
        }
      }
    }
  }
</script>
