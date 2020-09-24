<!--
- src/pages/Home/MemberFace.vue
-
- Avatar or a member of a project.
-
- Props:
-   url: photo URL (part of userInfo)
-   active: boolean ('true' if currently working)
-->
<template>
  <img :src="url">
</template>

<style scoped>
  .img {
    background-color: palegreen;
  }
</style>

<script>
  export default {
    name: 'MemberFace',
    props: {
      url: { type: URL, required: true },
      active: { type: Boolean, required: false, default: false }
    }
  };
</script>
