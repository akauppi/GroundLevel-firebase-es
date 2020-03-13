<!--
- src/components/ProjectTile.vue
-
- The button to create a new project or open an existing one.
-
- Props:
-   project: { title: string, created: datetime, lastUsed: datetime }
-
- Todo:
-   - eventually, we'd have a thumbnail as the background of existing projects' tiles.
-->
<template>
  <div class="project-tile" v-bind:class="{ 'new-project-tile': isNewTile }">
    <template v-if="isNewTile">
      NEW PROJECT
      <br />
      <button id="new-project">+ Create</button>
    </template>
    <template v-else>
      {{ project.title }}
      {{ project.created.toLocaleString() }}
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
