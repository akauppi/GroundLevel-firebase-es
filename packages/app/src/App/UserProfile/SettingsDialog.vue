<!--
- src/App/UserProfile/SettingsDialog.vue
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

      <!-- tbd. Photo of oneself
      <MemberFace :user></MemberFace>
      <label>This is how others see you</label>
      -->

      <!--
      <label>Your setting here:</label>
      <input list="holidays" placeholder="your favourite holiday destination"/>
      <datalist id="holidays">
        <option value="Greece" />
        <option value="Spain" />
        <option value="Italy" />
        <option value="Madagascar" />
        <option value="Moon" />
      </datalist>
      -->
    </div>
    <hr />
    <!-- tbd. layout sucks -->
    <label>Version:</label><span>&nbsp;{{ RELEASE }}</span>

    <button class="gimme-error" @click.stop="gimmeError" >Cause an ERROR</button>    <!-- for Sentry exercising -->
    <button class="log-hey" @click.stop="gimmeHey" >Log HEY!</button>    <!-- for Realtime Database logging exercising -->

    <button class="signOut" @click.stop="signOut" >Sign out</button>
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

  cursor: pointer;    /* tbd. can we omit this if 'LOCAL'? #help */
}
</style>

<script>
  import { onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { getAuth, signOut as fbSignOut } from '@firebase/auth'

  import { userRef2 as user } from '/@/user'

  import { logHey_INFO } from '/@central/logs'

  const LOCAL = import.meta.env.MODE === 'dev_local'

  const RELEASE = import.meta.env.VITE_RELEASE ||
    (LOCAL ? "(local development)" : "(local production build)");

  // Borrowing a component from deep in. (maybe it is moved to '/components', later, if used in multiple places?)
  //
  //import MemberFace from '/@pages/Home/ProjectTile/MemberFace.vue'    // #later

  let closeEl;    // DOM element, gets set during mounting

  // If 'esc' pressed while dialog is visible, flash the close button visually.
  //
  function escListener(evt) {
    if (evt.key === "Escape") {
      closeEl.classList.add("fakeHover");
      setTimeout( () => closeEl.click(), 20);   // just enough to notice it
    }
  }

  function setup(_, { emit, refs }) {
    const router = useRouter();

    // 'closeEl' is valid only after mounting, so safest to activate the listener only then.
    onMounted( () => {
      document.addEventListener('keyup', escListener);
    });

    onUnmounted( () => {
      document.removeEventListener('keyup', escListener);
    });

    async function signOut () {
      // tbd. Call here 'central.flush', to make sure any pending counters/logs are shipped.

      await fbSignOut( getAuth() );    // sign out also under emulation (LOCAL)

      router.push({ name: 'Home.guest' });
    }

    function closeMe() {
      emit('closeMe')
    }

    return {
      closeEl,
      user,
      closeMe,
      signOut,
      gimmeError: () => { throw new Error('for sentry') },
      LOCAL,
      RELEASE,
      gimmeHey: async () => {
        await logHey_INFO();
        console.log("!!! Logged to central; please check?")
      }
    }
  }

  export default {
    name: 'SettingsDialog',
    components: {
      //MemberFace
    },
    setup
  };
</script>
