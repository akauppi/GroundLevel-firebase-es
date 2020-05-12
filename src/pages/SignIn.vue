<!--
- src/pages/SignIn.vue
-
- Note: Only this page needs 'firebaseui'. Maybe we should bring it here, one day (now in 'index.html'). Not urgent.
-
- References:
-   - Easily add sign-in to your Web app with FirebaseUI (Firebase docs)
-     -> https://firebase.google.com/docs/auth/web/firebaseui
-->
<template>
  <!-- tbd. Replace this with a spinner when signing-in is in process... #help
  -->
  <h1>WELCOME STRANGER!</h1>
  <div>
    Would you like to log in - <strike>you can do it anonymously</strike>..?  No login, no app.
  </div>
  <div id="firebaseui-container" />
  <div>
    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
    Built upon <a href="https://github.com/akauppi/GroundLevel-firebase-web" target="_blank">GroundLevel ♠️ ES6</a> (source)
  </div>
</template>

<style scoped>
  * {
    text-align: center;
  }
  h1 {
    margin-top: 150px;
  }

  #firebaseui-container {
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>

<script>
  import { allowAnonymousAuth } from '../config.js';
  import { assert } from '../util/assert.js';

  /*
  * This was made to be a function, in case we would inject 'firebaseui' to just this page.. Which we don't do;
  * see 'index.html'.
  */
  function uiConfig(successUrl) {     // (string) => {...}
    assert(firebaseui);

    return {
      signInFlow: 'redirect',     // default
      signInSuccessUrl: successUrl,
      signInOptions: [
        // OAuth providers
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        //firebase.auth.GithubAuthProvider.PROVIDER_ID,

        // Email auth is pretty complex, and we didn't really care for it.

        // tbd. Enable this later. NOTE: it uses 'firebaseui'
        allowAnonymousAuth && firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
      ],

      // tbd. not tested...
      autoUpgradeAnonymousUsers: allowAnonymousAuth,

      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          // authResult: {
          //    credential: { ..., token: string, ... }
          //    operationType: "signIn"
          //    user: { displayName: string, ... }    // normal Firebase user object
          //    additionalUserInfo: { isNewUser: boolean, profile: { name: ..., granted_scopes: string }
          // }
          //
          // redirectUrl: undefined
          //
          // User successfully signed in.
          //
          // Return type determines whether we continue the redirect automatically or whether we leave that to the developer.

          console.log("In a callback.", authResult, redirectUrl);
          return true;
        },

        // Anonymous user upgrade: 'signInFailure' callback must be provided to handle merge conflicts which occur when
        // an existing credential is linked to an anonymous user.
        //
        signInFailure: (error) => {
          if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
            return Promise.resolve();
          }

          // The credential the user tried to sign in with.
          const cred = error.credential;

          // Copy data from anonymous user to permanent user and delete anonymous user.
          // ... (this part would be application specific, i.e. rearranging user data in database) ...
          //    see -> https://firebase.google.com/docs/auth/web/anonymous-auth?hl=fi
          //
          //    "If the call to link succeeds, the user's new account can access the anonymous account's Firebase data."
          //
          // Finish sign-in after data is copied.

          return firebase.auth().signInWithCredential(cred);
        }
      },

      //disabled
      //tosUrl: '<your-tos-url>',     // Terms of Service
      //privacyPolicyUrl: '<your-privacy-policy-url>',    // Privacy policy
    };
  };

  /*** DISABLED (but keep)
  /*
  * Inject FirebaseUI to the current page. (see comments at the top for why)
  *
  * Note: Svelte 3 has header directives. We could do all this declaratively, there. #just-saying
  *
  * Crafted based on:
  *   -> https://stackoverflow.com/questions/8578617/inject-a-script-tag-with-remote-src-and-wait-for-it-to-execute#answer-39008859
  *_/
  // NOT USED!!!
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
   const injectedProm = Promise.resolve(); //injectFirebaseUI();
  ***/

  export default {
    name: 'SignIn',

    created() {
      const toPath = this.$route.query.final || '/';

      console.log("Once signed in, we'd 🛵 to: "+ toPath);

      // Decision: what auth state persistence does your app favor?
      // See -> https://firebase.google.com/docs/auth/web/auth-state-persistence?hl=fi
      //
      // tbd. This could be driven from 'config.js'
      //
      // 'Persistence.SESSION': "Existing and future Auth states are now persisted in the current session only.
      //                        Closing the window would clear any existing state even if a user forgets to sign out."
      //                        (source: FirebaseUI sources)
      //
      firebase.auth().setPersistence( firebase.auth.Auth.Persistence.SESSION )
        .then(
          console.debug("Persistence changed")    // we don't really care, do we?
        )
        .catch( error => {
          console.error('Error in \'.setPersistence\'', error.code, error.message);
        });

      // If using the injection, bring the rest in once that Promise has succeeded.

      // Note: There's no harm in not moving as 'this.$route.push(toPath)', right? Think not. #help
      //
      const uiConfig = uiConfig(toPath);
      const ui = new firebaseui.auth.AuthUI(firebase.auth());

      ui.start("#firebaseui-container", uiConfig);
        //
        // Note: This is not the place for 'ui.isPendingRedirect()' - and it's for email auth only, anyhow.
    }
  };
</script>