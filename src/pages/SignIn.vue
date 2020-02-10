<!--
- src/pages/SignIn.vue
-->
<template>
  <section>
    <div id="stranger">
      <h1>WELCOME STRANGER!</h1>
      <div>
        Would you like to log in - you can do it anonymously..?  No login, no app.
      </div>
      <div id="firebaseui-auth-container" />
      <div>
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <a href="https://github.com/akauppi/GroundLevel-firebase-web" target="_blank">About the application</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
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
  import { allowAnonymousAuth } from '../config.js';

  // If we have it via 'npm':
  //import { auth as firebaseUi_auth } from 'firebaseui/dist/esm.js';  // npm

  const uiConfig = {
    signInSuccessUrl: "/somein",    // tbd. use 'redirect' query param (default to some main page)
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      //firebase.auth.GithubAuthProvider.PROVIDER_ID,
      //firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      allowAnonymousAuth && firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
    ],
    autoUpgradeAnonymousUsers: allowAnonymousAuth,

    /* disabled
    // Terms of service
    tosUrl: '<your-tos-url>',
    // Privacy policy
    privacyPolicyUrl: '<your-privacy-policy-url>',
    */

    callbacks: {
      signInSuccessWithAuthResult: () => {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
      uiShown: () => {
        // The widget is rendered. (can hide a loader but we have none)
      },

      // 'signInFailure' callback must be provided to handle merge conflicts which
      // occur when an existing credential is linked to an anonymous user.
      //
      signInFailure: (error) => {
        if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
          return Promise.resolve();
        }

        // The credential the user tried to sign in with.
        const cred = error.credential;

        // Copy data from anonymous user to permanent user and delete anonymous user.
        // ...
        // Finish sign-in after data is copied.
        return firebase.auth().signInWithCredential(cred);
      }
    }
  };

  export default {
    name: 'SignIn',     // tbd. is this needed?
    mounted() {
      //const ui = new firebaseUi_auth.AuthUI(firebase.auth());

      // Directly loaded
      const ui = new firebaseui.auth.AuthUI(firebase.auth());

      // Note: Checking '.isPendingRedirect' is connected to using 'firebase.auth.EmailAuthProvider', but it doesn't harm
      //      for other means.
      //
      // "When rendering the sign-in UI conditionally (relevant for single page apps), use 'ui.isPendingRedirect()' to detect
      // if the URL corresponds to a sign-in with email link and the UI needs to be rendered to complete sign-in."
      //      source -> https://firebase.google.com/docs/auth/web/firebaseui
      //
      if (ui.isPendingRedirect()) {
        ui.start("#firebaseui-auth-container", uiConfig);

        debugger;
        console.log("Hmm.. auth UI should now show?");
      }
    },
    methods: {
    },
  };
</script>