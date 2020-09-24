<!--
- src/pages/Home/ProjectTile.vue
-
- The button to create a new project or open an existing one.
-
- Props:
-   project: { _id: string, ..projectsC document fields }
-->
<template>
  <template v-if="isNewTile">
    <div class="project-tile new-tile">
      <div>NEW PROJECT</div>
      <button role="link" id="new-project">+ Create</button>
    </div>
  </template>
  <template v-else>
    <!-- Using slot with 'router-link'
    -     -> https://next.router.vuejs.org/guide/migration/#removal-of-event-and-tag-props-in-router-link
    -->
    <router-link v-bind:to="`/projects/${project._id}`"
                 custom
                 v-slot="{ navigate }"
    >
      <div @click="navigate" role="link" class="project-tile">
        <div class="title">{{ project.title }}</div>

        <!-- users having access to the project; those currently working in it highlighted.
        -->
        <MemberFace v-for="id in project.members" :userId="id" />
      </div>
    </router-link>
  </template>
</template>

<style scoped lang="scss">
  .project-tile {
    padding: 30px;
    background-color: lightblue;   /* default color */
    border-radius: 10px;

    width: 150px;
    height: 100px;
  }

  .new-tile {
    background-color: palegreen;

    button {
      margin-top: 0.5em;
      font-size: 0.8em;
    }
  }

  .project-tile:not(.new-tile) {
    .title {
      font-weight: bold;
      margin-bottom: 1.5em;
    }
  }

  /* 'role=link' is accessibility stuff. We use it for providing the mouse hand. */
  [role="link"]:hover {
    cursor: pointer;
  }
</style>

<script>
  import MemberFace from './MemberFace.vue';

  export default {
    name: 'ProjectTile',
    components: {
      MemberFace
    },
    props: {
      project: { type: Object, required: false, default: null }
    },
    computed: {
      isNewTile: (vm) => vm.project == null
    }
  };
</script>
