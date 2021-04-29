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
    <aside-keys />
  </main>
  <footer>
    <AppFooter />
    <button id="errorBtn" v-on:click="makeError">Make error!</button>
  </footer>
</template>

<style scoped lang="scss">
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

  #errorBtn {
    position: fixed;
    bottom: 0;
    right: 0;
    margin: 0.3em;
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
</style>

<script>
  import { assert } from '/@tools/assert'

  import { onMounted, getCurrentInstance } from 'vue'

  import AppLogo from './AppLogo.vue'
  import UserProfile from './UserProfile/index.vue'
  import AppFooter from './AppFooter.vue'

  import { userRef2 } from '/@/user'

  const LOCAL = import.meta.env.MODE === 'dev_local';
  const TESTING = LOCAL && window.Cypress;

  /*** disabled (do we need this?)
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
    debugger;
  }*/

  function makeError() {
    throw new Error("Error for testing!");
  }

  function setup() {
    onMounted(() => {
      console.log("Houston, App is mounted");
    });

    //const appConfig = getCurrentInstance().appContext.config;   // must be within 'setup()'

    /*** disabled
    // Error handler. This is called within Vue lifecycle. If we don't tap into it, Vue gives one or two warnings
    // about "Unhandled error during..." and eventually the error is passed to (console / central catch in ops).
    //
    // The warnings etc. give us all the info we need for development. No benefit in catching the error.
    //
    if (errorHandler) {
      assert (appConfig.errorHandler === undefined);    // we're not overwriting anything
      appConfig.errorHandler = errorHandler;
    }*/

    return {
      user: userRef2,
      LOCAL,
      TESTING,
      makeError   // IDE note: used though dimmed
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
