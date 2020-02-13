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
  import { signOut } from '../auth.js';

  const genUiConfig = (toPath) => ({
    signInSuccessUrl: toPath,
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
  });

  /*
  * Inject FirebaseUI to the current page. (see comments at the top for why)
  *
  * Note: Svelte 3 has header directives. We could do all this declaratively, there. #just-saying
  *
  * Crafted based on:
  *   -> https://stackoverflow.com/questions/8578617/inject-a-script-tag-with-remote-src-and-wait-for-it-to-execute#answer-39008859
  */
  function injectFirebaseUI() {   // () -> Promise of something ('firebaseui' is set as a global)
    console.log("INJECTING FIREBASE UI");   // DEBUG

    // For what we need, see -> https://github.com/firebase/firebaseui-web#option-1-cdn
    //  <<
    //    <script src="https://www.gstatic.com/firebasejs/ui/4.4.0/firebase-ui-auth.js"> < /script>
    //    <link type="text/css" rel="stylesheet" href="https://www.gstatic.com/firebasejs/ui/4.4.0/firebase-ui-auth.css" />
    //  <<

    const a = document.createElement('script');
      //
      a.async = true;
      a.src = 'https://www.gstatic.com/firebasejs/ui/4.4.0/firebase-ui-auth.js';

    const b = document.createElement('link');
      //
      b.type = 'text/css';
      b.rel = 'stylesheet';
      b.href = 'https://www.gstatic.com/firebasejs/ui/4.4.0/firebase-ui-auth.css';

    return new Promise((resolve, reject) => {
      a.addEventListener('load', resolve, { once: true } );
      a.addEventListener('error', () => reject('Error loading script'));    // tbd. can we get an error description in the listener, and pass it on?
      a.addEventListener('abort', () => reject('Script loading aborted'));  //    -''-

      // see -> https://stackoverflow.com/questions/14910196/how-to-add-multiple-divs-with-appendchild/19759120#answer-14910308
      const tmp = document.createDocumentFragment();
        //
        tmp.appendChild(a);
        tmp.appendChild(b);

      document.head.appendChild(tmp);
    });
  }

  // Inject right here (not dependent on Vue component lifespan). Once the promise is fulfilled, 'firebaseui' should exist.
  //
  const injectedProm = injectFirebaseUI();

  export default {
    name: 'SignIn',     // tbd. is this needed?

    // Taking the code in here, so we have access to Vue-router's 'this.$route.query' API (could do otherwise, in plain JS).
    //
    // tbd. Should we wait as far as 'mounted' for this? 'created', maybe?
    created() {
      const toPath = this.$route.query.final || '/';

      // If it were that we get here signed in (development, or user gave manually a URL), sign out. Helps us keep
      // things consistent.
      //
      signOut();

      injectedProm.then( () => {
        if (typeof firebaseui === 'undefined') throw "No 'firebaseui' global - how come???!";   // assert

        const ui = new firebaseui.auth.AuthUI(firebase.auth());

        // Note: Checking '.isPendingRedirect' is connected to using 'firebase.auth.EmailAuthProvider', but it doesn't harm
        //      for other means.
        //
        // "When rendering the sign-in UI conditionally (relevant for single page apps), use 'ui.isPendingRedirect()' to detect
        // if the URL corresponds to a sign-in with email link and the UI needs to be rendered to complete sign-in."
        //      source -> https://firebase.google.com/docs/auth/web/firebaseui
        //
        if (true) /*(ui.isPendingRedirect())*/ {    // tbd. enable once redirecting has been done to work!  (now was just hiding the dialog)
          ui.start("#firebaseui-auth-container", genUiConfig(toPath));
        }
      });
    }
  };
</script>