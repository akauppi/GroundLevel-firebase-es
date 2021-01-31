<!--
- src/pages/SignIn.vue
-
- References:
-   - Easily add sign-in to your Web app with FirebaseUI (Firebase docs)
-     -> https://firebase.google.com/docs/auth/web/firebaseui
-->
<template>
  <!-- tbd. Place the branding picture here
  -->
  <h1>WELCOME STRANGER!</h1>
  <aside-key api-key={{apiKey}} auth-domain={{authDomain}} />
</template>

<!--
<style scoped>
  * {
    text-align: center;
  }
  h1 {
    margin-top: 150px;
  }
</style>
-->

<script>
  import firebase from 'firebase/app'
  import '@firebase/auth'

  import '@akauppi/aside-keys';   // <aside-keys> tag

  import { onMounted } from 'vue'
  import { allowAnonymousAuth } from '/@/config.js'

  export const apiKey = import.meta.env.VITE_API_KEY;
  export const authDomain = import.meta.env.VITE_AUTH_DOMAIN;

  function setup(props) {
    const {routerProm, final} = props;    // no need for reactivity: can use object destructuring

    // tbd. follow the auth changes (via 'aside-keys' event); when authenticated, move to 'final'

    /*** left-over?
    onMounted(async () => {
      const toPath = final || '/';
      console.log("Once signed in, we'd 🛵 to: " + toPath);
    })
    ***/
    return {}   // nothing to expose
  }

  // Note: Getting 'routerProm' as a property (instead of importing) is vital for avoiding a cyclic dependency
  //    between 'router.js' and this module. While those are not illegal in ES, they do cause (unnecessary) warnings
  //    in Rollup, and are generally a source of unnecessary complexity.
  //
  export default {
    name: 'SignIn',
    props: {
      final: String,        // URL query parameter: e.g. "..." | undefined
      routerProm: Object    // Promise of Router
    },
    setup
  }
</script>
