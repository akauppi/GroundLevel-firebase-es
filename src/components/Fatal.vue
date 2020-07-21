<!--
- src/components/Fatal.vue
-
- A banner or other such entry enabled if a fatal (unexpected code path) incident happens.
-
- Pushes the rest of the application down (between it and top margin; full width).
-->
<template>
  <div>
    SOMETHING BAD HAPPENED
  </div>
  <button>dismiss</button>
</template>

<style scoped>
  div {
    position: absolute;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>

<script>
</script>
