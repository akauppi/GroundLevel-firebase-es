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
  </main>
  <footer>
    <app-footer />
    <button id="errorBtn" v-if="mode !== 'production'" v-on:click="makeError">Make error!</button>
  </footer>
</template>

<style scoped lang="scss">
  header {
    position: relative;   /* allow 'fatal' to be totally on its own (children can use 'position:relative') */
  }
  #mode {
    position: relative;
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
  import { onMounted, getCurrentInstance, ref } from 'vue'

  import AppLogo from './components/AppLogo.vue'
  import AppProfile from './components/AppProfile/index.vue'
  import AppFooter from './components/AppFooter.vue'

  import { user } from './refs/user.js'

  // Start maintaining 'userInfo' collection when the logged in user changes
  import './firebase/userInfo'

  import { vueWarning } from "./logging";

  function setup(props) {
    const { mode } = props;

    console.debug("App mode:", mode);

    // Note: We rather take the title from here than in 'public/index.html', keeping it application agnostic.
    onMounted(() => {
      console.log("Houston, App is mounted");
    });

    const appConfig = getCurrentInstance().appContext.config;
      //
      assert (appConfig.errorHandler === undefined);    // we're not overwriting anything
      assert (appConfig.warnHandler === undefined);

    /***  We benefit from this only if we wish to see Vue specific context.
    // '.errorHandler' catches errors "during component rendering" (well, and watch callbacks, lifecycle hooks,
    //                  component event handlers) - but still only Vue specific code.
    //
    // err: "error trace"
    // vm: "component in which error occurred"
    // info: "setup function" |...
    //    "Vue specific error information such as lifecycle hooks, events etc."
    //
    appConfig.errorHandler = (err, vm, info) => {   // (Error, Proxy, string) => ()

      throw err;    // pass on
    }
    **/

    // For warnings, most important to see them in the browser console (disabled in production, by Vue itself)
    //
    if (mode !== 'production') {   // "only works during development"
      appConfig.warnHandler = (msg, vm, trace) => {
        console.warn("Vue warning:", {msg, vm, trace});

        central(vueWarning, `Vue warning: ${msg}`, {vm, trace});
      }
    }

    // Note: We get the Vue warning:
    //  <<
    //    Property "user" was accessed during render but is not defined on instance.
    //  <<
    //
    //   This is not harmful but a way to mitigate such warning is appreciated. #help

    function makeError() {
      throw new Error("Error for testing!");
    }

    return {
      user,
      makeError
    }
  }

  export default {
    name: 'App',     // helps in debugging
    components: {
      AppLogo, AppProfile, AppFooter
    },
    props: {
      mode: String    // 'dev_local'|'development'|'production'
    },
    setup
  }
</script>
