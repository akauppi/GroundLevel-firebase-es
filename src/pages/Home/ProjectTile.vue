<!--
- src/pages/Home/ProjectTile.vue
-
- The button to create a new project or open an existing one.
-
- Props:
-   project: { _id: string, ..projectsC document fields }
-->
<template>
  <div class="project-tile" :class="{ 'new-project-tile': isNewTile }">
    <template v-if="isNewTile">
      NEW PROJECT
      <br />
      <button id="new-project">+ Create</button>
    </template>
    <template v-else>
      <router-link :to="`/projects/${project._id}`">
        {{ project.title }}
        {{ project.created.toLocaleString() }}
        Authors: {{ project.authors }}
        Members: {{ project.members }}
      </router-link>
    </template>
  </div>
</template>

<style scoped>
  .project-tile {
    padding: 30px;
    background-color: lightblue;   /* default color */
    border-radius: 10px;

    width: 150px;
    height: 100px;
  }

  .new-project-tile {
    background-color: palegreen;
  }

  button#new-project {
    font-size: "+4"
  }
</style>

<script>
  export default {
    name: 'ProjectTile',
    props: {
      project: { type: Object, required: false, default: null }
    },
    computed: {
      isNewTile: (vm) => vm.project == null
    }
  };
</script>
