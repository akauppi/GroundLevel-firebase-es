<!--
- src/App.vue
-
- The frame of the application - same for all pages
-
- Reference:
-   - "Error tracking with Vue.js" (blog, Aug 2018)
-     -> https://rollbar.com/blog/error-tracking-vue-js/
-->
<template>
  <header>
    <app-logo />
    <div id="mode" v-bind:class="{ devLocal: mode === 'dev_local' /*, devOnline: mode === 'development'*/ }">
    </div>
    <!-- Note: 'user' can be 'null' at first, then either an object (signed in) or 'false' (signed out).
    -->
    <app-profile v-if="user" />
  </header>
  <main>
    <router-view />
    <aside-keys init-json=""/>
  </main>
  <footer>
    <app-footer />
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
    background-color: dodgerblue;
    &:after {
      content: 'EMULATION MODE';
    }
  }

  #errorBtn {
    position: fixed;
    bottom: 0;
    right: 0;
    margin: 0.3em;
  }
</style>

<script>
  import { assert } from '/@/assert'

  import { onMounted, getCurrentInstance } from 'vue'

  import AppLogo from './components/AppLogo.vue'
  import AppProfile from './components/AppProfile/index.vue'
  import AppFooter from './components/AppFooter.vue'

  import { userRef as user } from './auth/userRef.js'

  const _MODE = import.meta.env?.MODE || 'production';

  import { devVueWarningsToCentral } from "./config"

  import './auth/updateUserInfo'

  // Add '.xListen' to Firestore objects
  import '/@xListen/stab'

  import '@akauppi/aside-keys';   // brings in '<aside-keys>'    (tbd. the path will change!)

  /*
  * Vue warn handler
  *
  * This gets called e.g. with:
  *   msg = "Invalid prop: type check failed for prop "url". Expected ..."
  *   vm: null
  *   trace: "at <MemberFace>\nat <RouterLink>..."
  *
  * May be nice to have on the development console. This way, we don't have to have the browser dev tools open,
  * all the time.
  *
  * Note: This "only works in development" (Vue docs) so let's not even override when not.
  */
  const warnHandler = (_MODE !== 'production') && ((msg, vm, trace) => {

    // BUG: WE DON*T GET CALLED!

    // May want to suppress some warnings
    //
    if (msg.startsWith("You are using the Auth Emulator, ")) {   // ".. which is intended for local testing only.  Do not use with production credentials."
      return true;   // done
    }

    // Replicate default functionality (suppressed if we do override):
    //
    if (devVueWarningsToCentral) {
      console.warn(`[Vue warn]: ${msg}\n${trace}`);

      central.warn(`Vue warning: ${msg}`, {trace});
      return true;
    }
  });

  /*
  * Vue error handler
  *
  * Catches errors "during component rendering" (well, and watch callbacks, lifecycle hooks, component event handlers)
  * - but still only Vue specific code.
  *
  *   err:    Error     // eg. "TypeError: Cannot read property ..."
  *   vm:     Proxy     "component in which error occurred"
  *   info:   "setup function" |...   // "Vue specific error information such as lifecycle hooks, events etc."
  */
  /*
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

    const appConfig = getCurrentInstance().appContext.config;   // must be within 'setup()'

    /***
    // Error handler. This is called within Vue lifecycle. If we don't tap into it, Vue gives one or two warnings
    // about "Unhandled error during..." and eventually the error is passed to (console / central catch in ops).
    //
    // The warnings etc. give us all the info we need for development. No benefit in catching the error.
    //
    if (errorHandler) {
      assert (appConfig.errorHandler === undefined);    // we're not overwriting anything
      appConfig.errorHandler = errorHandler;
    }
    ***/

    if (warnHandler) {
      assert (appConfig.warnHandler === undefined);
      appConfig.warnHandler = warnHandler
    }

    return {
      user,
      mode: _MODE,
      makeError   // IDE note: used though dimmed
    }
  }

  export default {
    name: 'App',     // helps in debugging
    components: {
      AppLogo, AppProfile, AppFooter
    },
    setup
  }
</script>
