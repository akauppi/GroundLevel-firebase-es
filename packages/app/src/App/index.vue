<!--
- src/App/index.vue
-
- The frame of the application - same for all pages
-
- Reference:
-   - "Error tracking with Vue.js" (blog, Aug 2018)
-     -> https://rollbar.com/blog/error-tracking-vue-js/
-->
<template>
  <header>
    <AppLogo />
    <div id="mode" v-bind:class="{ devLocal: LOCAL && !TESTING, devTest: TESTING }">
    </div>
    <UserProfile v-if="user" />    <!-- 'user' is Ref of (undefined | null | { ..Firebase user object }) -->
  </header>
  <main>
    <router-view />
    <aside-keys>
      <!--
      - Facade on top of 'aside-keys' so it won't be clickable during 'dev:local'.
      -
      - tbd. Could have tooltip, but that's a non-tablet abstraction.   "Sign-in disabled for local development. Use 'npm run dev:online'."
      -->
      <div id="ak-cover" v-if="LOCAL">
        <span>Sign-in disabled</span>
      </div>
    </aside-keys>
  </main>
  <footer>
    <AppFooter />
  </footer>
</template>

<style lang="scss" scoped>
  #mode {
    position: fixed;
    top: 40px;
    left: 0;
    width: 9.1em;   /* Q: how to make it automatically scale, based on contents (from CSS)? #help #css */
    padding: 10px;
    display: none;
    border-radius: 10px;
  }
  #mode.devLocal {
    display: block;
    background-color: #ffc800;
    &:after {
      content: 'LOCAL MODE';
    }
  }
  #mode.devTest {
    display: block;
    background-color: steelblue;
    &:after {
      content: 'TEST MODE';
    }
  }

  /* Theming the side panel
  */
  aside-keys::part(frame) {
    /*
    background: rgba(255, 255, 255, 0.3);		/_* semi-transparent background *_/
    backdrop-filter: blur(1em);
    -webkit-backdrop-filter: blur(1em);
    border-radius: 1em 0 0 1em;
    box-shadow: 6px 6px 3px rgba(0, 0, 0, 0.2);
    */
    margin-top: -2em;
    padding-top: 2.8em;
    width: 255px;
    background: #f8f8f8;
    border: 0.5px solid rgba(100,100,100,0.4);
  }

  /*
  * tbd. Intention is to have the text in the middle, but it's.. good enough. You may #fix ;)
  */
  #ak-cover {
    width: 100%;
    height: 100%;
    z-index: 1000;
    position: absolute;
    display: flex;

    align-items: center;
    justify-content: center;

    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(4px);

    color: #888;
  }
</style>

<script>
  import { onMounted, getCurrentInstance } from 'vue'

  import AppLogo from './AppLogo.vue'
  import UserProfile from './UserProfile/index.vue'
  import AppFooter from './AppFooter.vue'

  import { userRef2 } from '/@/user'

  const LOCAL = import.meta.env.MODE === 'dev_local';
  const TESTING = LOCAL && window.Cypress;

  /*** disabled
  /*
  * Vue error handler
  *
  * Catches errors "during component rendering" (well, and watch callbacks, lifecycle hooks, component event handlers)
  * - but still only Vue specific code.
  *
  *   err:    Error     // eg. "TypeError: Cannot read property ..."
  *   vm:     Proxy     "component in which error occurred"
  *   info:   "setup function" |...   // "Vue specific error information such as lifecycle hooks, events etc."
  *_/
  const errorHandler = (err, vm, info) => {   // (Error, Proxy, string) => ()
    console.debug("In Vue error handler:", info);
    throw err;
  } ***/

  function setup() {
    onMounted(() => {
      console.log("Houston, App is mounted");
    });

    const appConfig = getCurrentInstance().appContext.config;   // must be within 'setup()'

    /*** disabled
    // Activate the error handler.
    //
    // This is called within Vue lifecycle. If we don't tap into it, Vue gives one or two warnings about
    // "Unhandled error during..." and eventually the error is passed to (console / central catch in ops).
    //
    // tbd. It is unclear, whether catching the error here gives added value. (Vue errors were NOT caught by ops,
    //    which is serious!!!)
    //
    if (errorHandler) {
      assert (appConfig.errorHandler === undefined);    // we're not overwriting anything
      appConfig.errorHandler = errorHandler;
    }***/

    return {
      user: userRef2,
      LOCAL,
      TESTING
    }
  }

  export default {
    name: 'App',     // helps in debugging
    components: {
      AppLogo, UserProfile, AppFooter
    },
    setup
  }
</script>
