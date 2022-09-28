<!--
- src/App/index.vue
-
- The frame of the application - same for all pages
-->
<template>
  <header>
    <AppLogo />
    <div id="mode" v-bind:class="{ devLocal: LOCAL && !TESTING, devTest: TESTING }">
    </div>
    <UserProfile v-if="user" />    <!-- 'user' is Ref of (undefined | null | { ..user object }) -->
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

    <!-- DEBUG/REMOVE -->
    <button @click="loginAsJoe()">User joe</button>
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
  import { onMounted } from 'vue'

  import AppLogo from './AppLogo.vue'
  import UserProfile from './UserProfile/index.vue'
  import AppFooter from './AppFooter.vue'

  import { userRef2 } from '/@/user'
  import {signInWithCustomToken, updateProfile, getAuth} from "@firebase/auth";   // TEMP
  import { assert } from '/@tools/assert'

  const LOCAL = import.meta.env.MODE === 'dev_local';
  const TESTING = LOCAL && window.Cypress;

  function setup() {
    onMounted(() => {
      console.log("Houston, App is mounted");
    });

    // tbd. just remove this? :?
    //const appConfig = getCurrentInstance().appContext.config;   // must be within 'setup()'

    return {
      user: userRef2,
      LOCAL,
      TESTING,
      loginAsJoe
    }
  }

  async function loginAsJoe() {   // DEBUG
    console.log(2);

    const auth = getAuth();

    const { user: /*as*/ currentUser } = await signInWithCustomToken( auth, JSON.stringify({ uid: "joe" }) );
    assert(currentUser.uid === "joe");

    // Set '.displayName', '.photoURL'; for email and password, other functions exist (not implemented)
    await updateProfile(currentUser, { displayName: "Avrell D." });

    console.log(4);
  }

  export default {
    name: 'App',     // helps in debugging (they say..)
    components: {
      AppLogo, UserProfile, AppFooter
    },
    setup
  }
</script>
