<!--
- src/pages/SignIn.vue
-
- Note: Only this page needs 'firebaseui'. We tried pulling it via npm but it has problems (bloating the bundle by 200k;
-     not properly depending on latest '@firebase/...' npm modules but earlier ones. Got all of that to work, but
-     the idea of isolating the whole thing here took over.
-
-     Cannot just add '<script>' to the template, though. Vue would give (build time):
-       <<
-         [rollup] Error: Templates should only be responsible for mapping the state to the UI. Avoid placing tags with \
-                   side-effects in your templates, such as <script>, as they will not be parsed.
-       <<
-
-     ..but we can inject the tags into 'head', at runtime.
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

  //import { auth as firebaseUi_auth } from 'firebaseui';  // npm

  const uiConfig = {
    signInSuccessUrl: "/somein",    // tbd. use 'redirect' query param (default to some main page)
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      //firebase.auth.GithubAuthProvider.PROVIDER_ID,
      //firebase.auth.PhoneAuthProvider.PROVIDER_ID,

      // tbd. Enable this later. Does it really use 'firebaseui'? (we don't have it here, yet; need to make this a factory)
      //allowAnonymousAuth && firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
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

  /*
  * Inject FirebaseUI to the current page. (see comments at the top for why)
  *
  * Note: Svelte 3 has header directives. We could do all this declaratively, there. #just-saying
  */
  function injectFirebaseUI() {
    console.log("INJECTING FIREBASE UI");   // DEBUG

    // For what we need, see -> https://github.com/firebase/firebaseui-web#option-1-cdn
    //  <<
    //    <script src="https://www.gstatic.com/firebasejs/ui/4.4.0/firebase-ui-auth.js"> < /script>
    //    <link type="text/css" rel="stylesheet" href="https://www.gstatic.com/firebasejs/ui/4.4.0/firebase-ui-auth.css" />
    //  <<

    const a = document.createElement('script');
      //
      a.src = 'https://www.gstatic.com/firebasejs/ui/4.4.0/firebase-ui-auth.js';

    const b = document.createElement('link');
      //
      b.type = 'text/css';
      b.rel = 'stylesheet';
      b.href = 'https://www.gstatic.com/firebasejs/ui/4.4.0/firebase-ui-auth.css';

    // see -> https://stackoverflow.com/questions/14910196/how-to-add-multiple-divs-with-appendchild/19759120#answer-14910308
    const tmp = document.createDocumentFragment();
      //
      tmp.appendChild(a);
      tmp.appendChild(b);

    document.head.appendChild(tmp);

    console.log("CSS and SCRIPT FOR FIREBASE UI should now be there. Are they?");   // DEBUG
  }

  export default {
    name: 'SignIn',     // tbd. is this needed?

    created() {
      console.log("SignIn created");  // DEBUG
      injectFirebaseUI()
    },

    mounted() {
      console.log("SignIn mounted");  // DEBUG

      if (!firebaseui) {
        throw "We're here too soon! Added elements didn't come to life, yet!"
      }

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