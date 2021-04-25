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
function setup() {
  const LOCAL = import.meta.env.MODE === 'dev_local';
  const TEST = LOCAL && window.Cypress;

  return {
    LOCAL, TEST
  }
}

export default {
  name: 'Home.guest',
  props: {
    final: { type: String, required: false }    // to mitigate a warning; sign-in uses it to get to a shared link's destination
  },
  setup
}
</script>
