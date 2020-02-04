<template>
  <div>
    <app-overlay />

    <!-- tbd. actual content here -->
    <div id="to-be-done">
      TO BE DONE 🏂
    </div>
  </div>
</template>

<style>
  #to-be-done {
    text-align: center;
    vertical-align: middle;
  }
</style>

<script>
import AppOverlay from './components/AppOverlay.vue';

export default {
  name: 'App',
  components: { AppOverlay }
};
</script>
