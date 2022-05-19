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

<style lang="scss" scoped>
@import 'shared.css';    // .new-tile

.new-tile {
  background-color: palegreen;

  button {
    margin-top: 0.5em;
    font-size: 0.8em;
  }
}
</style>

<script>
export default {
  name: 'NewTile'
};
</script>
