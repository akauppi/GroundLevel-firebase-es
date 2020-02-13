<!--
- src/components/AppProfile.vue
-
- Information about the user. Possibility to sign out.
- Only visible when signed in.
-
- NOTE: It would be so nice if Vue had built-in Promise support, like Svelte 3's '{await}'.
-->
<template>
  <section class="app-profile fixed-top-right">
    <div id="user-name">
      {{ displayName }}
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
  // We expect the user to be signed in and not to change, during our lifespan (there's no UI option to change the user).

  import { userProm, signOut as authSignOut } from '../auth.js';

  export default {
    name: 'AppProfile',
    data: () => {
      displayName: ''    // while waiting for auth
    },
    methods: {
      signOut() {
        authSignOut();
        this.$router.push('/');
      }
    },
    created () {
      userProm.then( (user) => {
        this.displayName = user.displayName;
      });
    }
  };
</script>
