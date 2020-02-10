<!--
- src/pages/SomeIn.vue
-->
<template>
  <section>
    <h1>Profile</h1>
    <h2>Hi {{name}}</h2>
    <button @click="signOut">Sign out</button>
  </section>

  <!-- tbd. later
  <div>
    <app-overlay />

    <!_-- Actual app content --_>
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
  -->
</template>

<script>
  export default {
    created() {
      this.name = firebase.auth().currentUser.displayName;
    },
    data() {
      return{
        name: ''    // tbd. can we set it to 'null'?
      }
    },
    methods: {
      signOut(){
        firebase.auth().signOut();
        this.$router.push('/');
      }
    }
  }
</script>

<style scoped>
  span{
    text-transform: uppercase;
    font-weight: bold;
    background: orangered;
    color: white;
    padding: 10px;
    font-size: 1.5em;
    transform: skew(20deg);
  }
</style>

