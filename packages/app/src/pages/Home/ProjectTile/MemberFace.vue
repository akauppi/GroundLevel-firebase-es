<!--
- src/pages/Home/MemberFace.vue
-
- Avatar or a member of a project.
-
- Props:
-   user: {     // derivative of the 'userInfoC' document; with '.status' added
-     displayName: string
-     photoURL: (part of userInfo)
-     status: "live"|"recent"|...   (live: currently working; recent: worked recently; other: no emphasis)
-   }
-->
<template>
  <img :src="user.photoURL">
  <div id="name">{{ user.displayName }}</div>   <!-- tbd. make into on-hover tooltip -->

  <!-- tbd. a halo around member photo + color from this, via CSS -->
  Status: {{ user.status }}
</template>

<style scoped>
  img {
    background-color: palegreen;
  }
</style>

<script>
  export default {
    name: 'MemberFace',
    props: {
      user: { type: Object, required: true },
    }
  };
</script>
