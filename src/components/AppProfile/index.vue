<!--
- src/components/AppProfile/index.vue
-
- Information about the user + possibility to open personal settings / sign out dialog.
- Only visible when signed in.
-->
<template>
  <div class="app-profile fixed-top-right" @click.stop="openDialog">
    <div id="user-name">
      {{ user ? (user.displayName || 'anonymous user') : 'WHAT?!?' }}
    </div>
    <!--
    - From https://icons.getbootstrap.com/
    -->
    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-gear" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M8.837 1.626c-.246-.835-1.428-.835-1.674 0l-.094.319A1.873 1.873 0 0 1 4.377 3.06l-.292-.16c-.764-.415-1.6.42-1.184 1.185l.159.292a1.873 1.873 0 0 1-1.115 2.692l-.319.094c-.835.246-.835 1.428 0 1.674l.319.094a1.873 1.873 0 0 1 1.115 2.693l-.16.291c-.415.764.42 1.6 1.185 1.184l.292-.159a1.873 1.873 0 0 1 2.692 1.116l.094.318c.246.835 1.428.835 1.674 0l.094-.319a1.873 1.873 0 0 1 2.693-1.115l.291.16c.764.415 1.6-.42 1.184-1.185l-.159-.291a1.873 1.873 0 0 1 1.116-2.693l.318-.094c.835-.246.835-1.428 0-1.674l-.319-.094a1.873 1.873 0 0 1-1.115-2.692l.16-.292c.415-.764-.42-1.6-1.185-1.184l-.291.159A1.873 1.873 0 0 1 8.93 1.945l-.094-.319zm-2.633-.283c.527-1.79 3.065-1.79 3.592 0l.094.319a.873.873 0 0 0 1.255.52l.292-.16c1.64-.892 3.434.901 2.54 2.541l-.159.292a.873.873 0 0 0 .52 1.255l.319.094c1.79.527 1.79 3.065 0 3.592l-.319.094a.873.873 0 0 0-.52 1.255l.16.292c.893 1.64-.902 3.434-2.541 2.54l-.292-.159a.873.873 0 0 0-1.255.52l-.094.319c-.527 1.79-3.065 1.79-3.592 0l-.094-.319a.873.873 0 0 0-1.255-.52l-.292.16c-1.64.893-3.433-.902-2.54-2.541l.159-.292a.873.873 0 0 0-.52-1.255l-.319-.094c-1.79-.527-1.79-3.065 0-3.592l.319-.094a.873.873 0 0 0 .52-1.255l-.16-.292c-.892-1.64.902-3.433 2.541-2.54l.292.159a.873.873 0 0 0 1.255-.52l.094-.319z"/>
      <path fill-rule="evenodd" d="M8 5.754a2.246 2.246 0 1 0 0 4.492 2.246 2.246 0 0 0 0-4.492zM4.754 8a3.246 3.246 0 1 1 6.492 0 3.246 3.246 0 0 1-6.492 0z"/>
    </svg>
  </div>

  <!--
  - A full screen overlay (blur) + dialog above it
  -
  - Note: '@keyup:esc=...' does not work on a div. Doing it in code.
  -->
  <div id="modal-background" v-if="isOpen" @click.stop="closeDialog">
    <setup-dialog @closeMe="closeDialog" />
  </div>
</template>

<style scoped>
  .app-profile {
    display: flex;
    cursor: pointer;    /* whole corner acts as a link */

    padding: 0.8em;

    background-color: #222;
    color: #ddd;
    border-radius: 0 0 0 1em;

    /* 😁 https://www.cssmatic.com/box-shadow */
    -webkit-box-shadow: 3px 3px 10px 0px rgba(0,0,0,0.5);
    -moz-box-shadow:    3px 3px 10px 0px rgba(0,0,0,0.5);
    box-shadow:         3px 3px 10px 0px rgba(0,0,0,0.5);
  }

  #user-name {
    padding-left: 0.4em;
  }
  .bi-gear {
    color: #ddd;
    font-size: 1em;
    padding-left: 0.6em;
  }

  /*** disabled
  .fade-enter-active,
  .fade-leave-active {
    transition: all .2s ease-out;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  ***/

  /* Note: Firefox (Aug 2020): 'backdrop-filter' implemented but not enabled by default
  *     -> https://bugzilla.mozilla.org/show_bug.cgi?id=1178765
  */
  #modal-background {
    display: block;
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;

    z-index: 9999;

    backdrop-filter: blur(6px);

    /*-webkit-transition: 0.5s;*/
    /*transition: all 3s linear;*/
  }

  .fixed-top-right {
    position: fixed;
    top: 0;
    right: 0;
  }
</style>

<script>
  // Note: the user remains the same throughout our lifespan (there's no UI option to change the user).

  assert(firebase);

  import { ref, watch } from 'vue'

  //import { user } from '/@/refs/user.js'
  import { user } from '../../refs/user.js'

  import SetupDialog from './SetupDialog.vue'

  const isOpen = ref(false);

  function openDialog() {
    console.log("Shazam!");
    isOpen.value = true;
  }

  function closeDialog() {
    console.log("BAM!");
    isOpen.value = false;
  }

  function setup() {
    return {
      isOpen,
      openDialog,   // IDE note: mistakenly shows these dimmed (they are used)
      closeDialog,
      user
    }
  }

  export default {
    name: 'AppProfile',
    components: { SetupDialog },
    setup
  };
</script>
