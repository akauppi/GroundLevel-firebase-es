<!--
- src/pages/Home.guest.vue
-
- The default page (URL /), with the user not signed in.
-->
<template>
  <h1>Some kind words about the app. 🐯</h1>

  <p>This is a guest page. It can have a presentation of your application.</p>

  <p v-if="LOCAL && !TEST">Provide a <span class="tt">?user=dev</span> parameter to sign in.</p>
  <p v-else>To the right, there should be a sign-in panel visible.</p>
</template>

<style scoped>
div {
  /*background-image: url('/guest.png');*/
}
* {
  text-align: center;
}
p {
  font-family: "Roboto", sans-serif;
}
h1 {
  font-size: 40px;
  margin-top: 3em;
  color: gray;
}
span.tt {
  font-family:'Lucida Console', monospace;
  background-color: #eee;
  padding: 0.3em;
}
</style>

<script>
import { onMounted, onUnmounted, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import {userRef2} from "../../user.js";

const LOCAL = import.meta.env.MODE === 'dev_local';
const TEST = LOCAL && window.Cypress;

// Note: The 'this.$route[r]' approach only works with Vue.js 2 syntax. We use Composition API (v3)
//  so a little longer route (no pun) is needed.

function setup() {
  const router = useRouter();

  // If signed in, move to the user's Home page, or to the final destination.
  //
  // Use of 'final' allows getting a link (e.g. via email), clicking it, authenticating, and landing
  // on the intended destination after sign-in.
  //
  onMounted( _ => {
    const route = router.currentRoute.value;    // note: could also be 'useRoute()'

    const unsub = watchEffect( _ => {
      if (userRef2.value) {
        const final = route.query["final"];

        // Can move to path '/' (instead of '{ name: "Home" }' since signed in page has precedence.
        //
        router.push( final || '/' );

        unsub();
      }
    })
  });

  return {
    LOCAL, TEST
  }
}

export default {
  name: 'HomeGuest',
  props: {
    final: { type: String, required: false }    // to mitigate a warning; sign-in uses it to get to a shared link's destination
  },
  setup
}
</script>
