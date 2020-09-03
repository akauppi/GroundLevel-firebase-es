<!--
- src/components/AppProfile/SetupDialog.vue
-
- Dialog that shows a person's settings (if any) and a Sign out -button.
-
- Shows in the middle of the parent element (which it absolute positioning, edge-to-edge).
-->
<template>
  <!-- '@click.stop=""' to prevent clicks going to parent and closing the dialog.
  -->
  <div id="dialog" @click.stop="">
    Personal settings
    <div ref="closeEl" class="close" @click.stop="closeMe">
      <!--
      - Close; from -> https://icons.getbootstrap.com/icons/x/
      -->
      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
        <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
      </svg>
    </div>

    <!-- Doing the content as a Flexbox (not list) -->
    <div id="content">
      <label>Your setting here:</label>
      <input list="holidays" placeholder="your favourite holiday destination"/>
      <datalist id="holidays">
        <option value="Greece" />
        <option value="Spain" />
        <option value="Italy" />
        <option value="Madagascar" />
        <option value="Moon" />
      </datalist>
    </div>
    <hr />
    <!-- tbd. layout sucks -->
    <label>Version:</label><span>{{ version || "(not available)" }}</span>
    <button class="signOut" @click.stop="signOut">Sign out</button>
  </div>
</template>

<style scoped>
#dialog {
  position: relative;  /*anchor for close 'position: absolute'*/

  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border-radius: 4px;
  max-width: 20em;
  height: 15em;
  margin-top: 3em;

  border: solid 1px black;

  font-family: "Avenir Next";   /* tbd. theme */

  /* 😁 https://www.cssmatic.com/box-shadow */
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);
}

.close {
  position: absolute;
  right: 1em;
  top: 1em;

  color: #aaaaaa;
  font-size: 20px;

  width: 1em;
  height: 1em;
  border-radius: 50%;   /* shows as round button */
}

.close:hover, .close.fakeHover {
  color: #000;
  background-color: #eee;
  text-decoration: none;
  cursor: pointer;
}

#content {
  margin-top: 1.2em;
  display: flex;
}
#content label {
  margin-right: 0.5em;
}

.signOut {
  position: absolute;
  right: 1em;
  bottom: 1em;
  font-size: 0.8em;

  cursor: pointer;
}
</style>

<script>
  assert(firebase);
  import { ref, onMounted, onUnmounted } from 'vue'

  import { routerProm } from '../../router.js'
  import { reportFatal } from "../../monitoring/reportFatal"

  const closeEl = ref(null);    // DOM element, gets set during mounting

  // If 'esc' pressed while dialog is visible, flash the close button visually.
  //
  function escListener(evt) {
    if (evt.key === "Escape") {
      closeEl.value.classList.add("fakeHover");
      setTimeout( () => closeEl.value.click(), 20);   // just enough to notice it
    }
  }

  function setup(_, { emit, refs }) {
    // 'closeEl' is valid only after mounting, so safest to activate the listener only then.
    onMounted( () => {
      document.addEventListener('keyup', escListener);
    });

    onUnmounted( () => {
      document.removeEventListener('keyup', escListener);
    });

    async function signOut() {
      try {
        await firebase.auth().signOut();
      }
      catch(ex) {
        reportFatal("Sign out failed", ex);   // not observed
      }

      const router = await routerProm;    // must wait for it here -> 'setup' must be synchronous (Vue.js 3.0)
      router.push('/signin');
    }

    return {
      closeEl,
      version: window.VERSION,    // provided by production build; undefined for dev
      closeMe: () => emit('closeMe'),
      signOut
    }
  }

  export default {
    name: 'SetupDialog',
    setup
  };
</script>
