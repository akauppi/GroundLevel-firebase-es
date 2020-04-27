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
-
- References:
-   - Easily add sign-in to your Web app with FirebaseUI (Firebase docs)
-     -> https://firebase.google.com/docs/auth/web/firebaseui
-->
<template>
  <section>
    <!-- tbd. Replace this with a spinner when signing-in is in process...
    -->
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
  import { assert } from '/@/util/assert';
  import { userMixin } from '/@/mixins/user';

  const genUiConfig = (goThere) => {     // ( () => () ) => {...}    // 'goThere' changes URL to the target
    assert(firebaseui);

    return {
      //signInFlow: 'redirect',   // 'redirect' is default
      //signInSuccessUrl: toPath,
      signInOptions: [
        // OAuth providers
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        //firebase.auth.GithubAuthProvider.PROVIDER_ID,

        /* Email auth is pretty complex, and we didn't really need / care for it. Enable and customize on your own risk!
        * Working contributions welcome!!
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
          // Allow the user the ability to complete sign-in cross device, including the mobile apps specified in the
          // 'ActionCodeSettings' object below.
          forceSameDevice: false,
          emailLinkSignIn: function() {
            return { ... see docs ... }
          }
        } */

        //firebase.auth.PhoneAuthProvider.PROVIDER_ID,

        // tbd. Enable this later. NOTE: it uses 'firebaseui'
        //allowAnonymousAuth && firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
      ],

      //disabled (tbd. enable when other things work)
      //autoUpgradeAnonymousUsers: allowAnonymousAuth,

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
          // Return type determines whether we continue the redirect automatically or whether we leave that to developer to handle.

          goThere();
          return false;   // FirebaseUI may chill 🧃
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

      /* disabled
      tosUrl: '<your-tos-url>',     // Terms of Service
      privacyPolicyUrl: '<your-privacy-policy-url>',    // Privacy policy
      */
    };
  };

  /*** DISABLED
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
  ***/

  // Inject right here (not dependent on Vue component lifespan). Once the promise is fulfilled, 'firebaseui' should exist.
  //
  //const injectedProm = Promise.resolve(); //injectFirebaseUI();

  export default {
    name: 'SignIn',     // tbd. is this needed?

    // Taking the code in here, so we have access to Vue-router's 'this.$route.query' API (could do otherwise, in plain JS).
    //
    // tbd. Should we wait as far as 'mounted' for this? 'created', maybe?
    created() {
      const toPath = this.$route.query.final || '/';

      // Decision: what auth state persistence does your app favor?
      // See -> https://firebase.google.com/docs/auth/web/auth-state-persistence?hl=fi
      //
      // tbd. This could be driven from 'config.js'
      //
      const prom = firebase.auth().setPersistence( firebase.auth.Auth.Persistence.SESSION )
        .catch( (error) => {
          console.error('Error in \'.setPersistence\'', error.code, error.message);
        });

      prom.then( () => {    // and if 'injectedProm' if we use it...
        // Note: Calling 'genUiConfig' here means it has access to 'firebaseui' - which it needs.
        //
        const uiConfig = genUiConfig( () => this.$router.push(toPath));    // we now have 'firebaseui' (even if injected)
        const ui = new firebaseui.auth.AuthUI(firebase.auth());

        ui.start("#firebaseui-auth-container", uiConfig);
          //
          // Note: This is not the place for 'ui.isPendingRedirect()' - and it's for email auth only, anyhow.
      });
    }
  };
</script>