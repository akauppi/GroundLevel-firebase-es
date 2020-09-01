<!--
- src/App.vue
-
- The frame of the application - same for all pages
-->
<template>
  <header>
    <fatal />
    <app-logo />
    <div id="emul" v-if="localMode">
      EMULATION MODE
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
  </footer>
</template>

<style scoped>
  #emul {
    padding: 10px;
    background-color: dodgerblue;

    position: fixed;
    top: 40px;
    left: 0;
  }
</style>

<script>
  import { onMounted } from 'vue'

  import AppLogo from './components/AppLogo.vue'
  import AppProfile from './components/AppProfile/index.vue'
  import AppFooter from './components/AppFooter.vue'
  import Fatal from './components/Fatal.vue'

  import { user } from './refs/user.js'

  // Start maintaining 'userInfo' collection when the logged in user changes
  import './firebase/userInfo'

  function setup() {
    // Note: We rather take the title from here than in 'public/index.html', keeping it application agnostic.
    onMounted(() => {
      console.log("Houston, App is mounted");
    });

    return { user }
  }

  export default {
    name: 'App',     // helps in debugging
    components: {
      AppLogo, AppProfile, AppFooter, Fatal
    },
    props: {
      localMode: Boolean    // 'true' if running against the local Firebase emulator
    },
    setup
  }
</script>
