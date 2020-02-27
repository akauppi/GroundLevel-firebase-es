<!--
- src/components/ProjectTile.vue
-
- The button to create a new project or open an existing one.
-
- Props:
-   project: Vue.observable{ title: ..., ... }      <-- can we even pass objects/classes as props?? tbd.
-->
<template>
  <div class="project-tile">
    PROJECT
    <template v-if="project === null">
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
    background-color: lightblue;
    border-radius: 10px;

    width: 150px;
    height: 100px;
  }

  button#new-project {
    font-size: "+4"
  }
</style>

<script>
  export default {
    name: 'ProjectTile',
    props: {
      project: {    // { title: String, created: time-stamp, lastUsed: time-stamp, ... }    ; for presentation purposes
        type: Object,
        required: false
      }
    },
    mounted() {
      console.log("MOUNTED", this.project);
    }
  };
</script>
