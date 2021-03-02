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
    <AppLogo />
    <div id="mode" v-bind:class="{ devLocal: LOCAL /*, devOnline: mode === 'development'*/ }">
    </div>
    <!-- 'user' is Ref of (undefined | null | { ..Firebase user object })
    -->
    <AppProfile v-if="user" />
  </header>
  <main>
    <router-view />
    <aside-keys v-if="!LOCAL" />
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
  import { assert } from '/@/assert'

  import { onMounted, getCurrentInstance } from 'vue'

  import AppLogo from './components/AppLogo.vue'
  import AppProfile from './components/AppProfile/index.vue'
  import AppFooter from './components/AppFooter.vue'

  import { userRef2 } from './user'

  const _MODE = import.meta.env?.MODE || 'production';    // tbd. needed? why the '|| "production"'?
  const LOCAL = import.meta.env.MODE === 'dev_local';

  import { devVueWarningsToCentral } from "./config"

  if (!LOCAL) {
    import ('/@background/updateUserInfo');
  }

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
      user: userRef2,
      LOCAL: _MODE === 'dev_local',
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
