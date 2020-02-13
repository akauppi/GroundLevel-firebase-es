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
  import { user, signOut as authSignOut } from '../auth.js';

  export default {
    name: 'AppProfile',
    computed: {
      displayName: () => user.displayName || '...'    // '??' "not in Safari yet" -> https://www.caniuse.com/#search=%3F%3F
    },
    methods: {
      signOut() {
        authSignOut();
        this.$router.push('/');
      }
    }
  };
</script>
