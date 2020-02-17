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
      {{ user ? user.displayName : '...' }}
    </div>
    <hr>  <!-- tbd. make into a push-down menu -->
    <button type="button"
            @click="signOut"
    >
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

  import { signOut as authSignOut } from '../auth.js';
  import { userMixin } from '@/mixins/user.js';

  export default {
    name: 'AppProfile',
    mixins: [userMixin],
    methods: {
      signOut() {
        // Note: We need to fly directly to sign-in page. Pushing like this seems to bypass the route guards.
        //
        authSignOut().then( () => {
          this.$router.push('/signin');
        });
      }
    }
  };
</script>
