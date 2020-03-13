<!--
- src/components/ProjectTile.vue
-
- The button to create a new project or open an existing one.
-
- Props:
-   project: { title: string, created: datetime, lastUsed: datetime }
-->
<template>
  <div class="project-tile" v-bind:class="{ 'new-project-tile': isNewTile }">
    PROJECT
    <template v-if="isNewTile">
      <button id="new-project">+ New Project</button>
    </template>
    <template v-else>
      {{ project.title }}
      {{ project.created }}
      {{ project.lastUsed }}
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
      project: {    // { title: String, created: datetime, lastUsed: datetime, ... }    ; for presentation purposes
        type: Object,
        required: false,
        default: null
      }
    },
    computed: {
      isNewTile: (vm) => vm.project == null
    },
    mounted() {
      //console.log("MOUNTED", this.project);
    }
  };
</script>
