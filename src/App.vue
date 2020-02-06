<template>
  <div>
    <app-overlay />

    <!-- Actual app content -->
    <div v-if="this.$root.signedIn" id="to-be-done">
      TO BE DONE 🏂
    </div>

    <div v-else>
      <div id="stranger">
        <h1>WELCOME STRANGER!</h1>
        <div>
          Would you like to log in - you can do it anonymously..?  No login, no app.
        </div>
        <div id="firebaseui-auth-container" />
        <div>
          <a href="https://github.com/akauppi/GroundLevel-firebase-web">About the application</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  #to-be-done {
    text-align: center;
  }

  #stranger {
    text-align: center;
    margin-top: 150px;
  }

  #firebaseui-auth-container {
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>

<script>
import AppOverlay from './components/AppOverlay.vue';

export default {
  //name: 'App',
  components: { AppOverlay }
};
</script>
