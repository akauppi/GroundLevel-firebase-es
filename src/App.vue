<!--
- src/App.vue
-
- The frame of the application - same for all pages
-->
<template>
  <!--
  <fatal v-if="fatalMessage"/>
  -->
  <header>
    <app-logo />
    <div id="mode" v-bind:class="{ devLocal: mode === 'dev_local', devOnline: mode === 'development' }">
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
  #mode {
    padding: 10px;
    position: fixed;
    top: 40px;
    left: 0;
    display: none;
  }
  #mode.devLocal {
    display: block;
    background-color: dodgerblue;
    content: 'EMULATION MODE';
  }
  #mode.devOnline {
    display: none;
    background-color: indianred;
    content: 'ONLINE MODE';
  }
</style>

<script>
  import { onMounted } from 'vue'

  import AppLogo from './components/AppLogo.vue'
  import AppProfile from './components/AppProfile/index.vue'
  import AppFooter from './components/AppFooter.vue'

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
      AppLogo, AppProfile, AppFooter
    },
    props: {
      mode: String    // 'dev_local', 'development' or 'production'
    },
    setup
  }
</script>
