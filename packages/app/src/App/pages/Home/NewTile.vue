<!--
- src/pages/Home/NewTile.vue
-
- The button to create a new project.
-->
<template>
  <div class="new-tile">
    <div>NEW PROJECT</div>
    <button role="link" id="new-project">+ Create</button>
  </div>
</template>

<style scoped>  /* lang="scss" */
@import './shared.css';

.new-tile {
  background-color: palegreen;

  /*** tbd. CSS nesting didn't work, yet (Oct 2022)
  & button {
    margin-top: 0.5em;
    font-size: 0.8em;
  }***/
}
.new-tile button {
  margin-top: 0.5em;
  font-size: 0.8em;
}
</style>

<script>
export default {
  name: 'NewTile'
};
</script>
