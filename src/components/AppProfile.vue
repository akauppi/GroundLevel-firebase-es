<!--
- src/components/AppProfile.vue
-
- Information about the user. Possibility to sign out.
- Only visible when signed in.
-->
<template>
  <section class="app-profile fixed-top-right">
    <div id="user-name">
      {{name}}
    </div>
    <hr>  <!-- tbd. make into a push-down menu -->
    <button @click="signOut">
      Sign out
    </button>
  </section>
</template>

<style scoped>
  .app-profile {
    padding: 10px;
  }

  .fixed-top-right {
    position: fixed;
    top: 0;
    right: 0;
  }
</style>

<script>
  export default {
    name: 'AppProfile',
    data() {
      return {
        // tbd. provide it as read-only #vue
        name: ''    // tbd. can we set it to 'null'?
      }
    },
    created() {
      this.name = firebase.auth().currentUser.displayName;
    },
    methods: {
      signOut(){
        firebase.auth().signOut();
        this.$router.push('/');
      }
    }
  };
</script>
