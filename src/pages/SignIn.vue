<!--
- src/pages/SignIn.vue
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
    Would you like to log in - you can do it anonymously..?
  </div>
  <div id="firebaseui-container" />
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
  /* disabled until the official way works
  import * as firebase from 'firebase/app';   // NOTE: do NOT use 'import firebase from ...' (does not work: "undefined as function" when importing Firebase UI)
  import 'firebase/auth';
  */
  assert(firebase && firebase.auth);

  import { onMounted } from 'vue';
  import { allowAnonymousAuth } from '../config.js';

  import { parseQuery } from 'vue-router';
  import { /*routerProm,*/ router } from '../router.js';

  // tbd. Vue-router 4.x has 'parseQuery' that's supposed to "work as URLSearchParams". Can you make it work? #help
  //    (makes sense to do all router/URL specific with Vue-router).
  //
  //const tmp = parseQuery(window.location.search).get('final');    // "some..."|null
  const tmp = new URLSearchParams(window.location.search).get('final');    // "some..."|null
  const toPath = tmp || '/';

  // SOUVENIR
  //const toPath = this.$route.query.final || '/';    // well that doesn't work any more #vuejs2

  console.log("Once signed in, we'd 🛵 to: " + toPath);

  // A promise, until one is able to use top level await (to get the route).
  //
  const uiConfigProm = (async () => {
    //const router = await RouterProm;
    //debugger;

    const uiConfig = {
      signInFlow: 'redirect',     // default (not popup)
      //signInSuccessUrl: toPath,   // nope: we are SPA and want to avoid page refreshes
      signInOptions: [
        // OAuth providers
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        //firebase.auth.GithubAuthProvider.PROVIDER_ID,

        // Email auth is pretty complex, and we didn't really care for it.

        allowAnonymousAuth && firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID   // note: This one uses 'firebaseui'
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

          console.log(toPath);
          debugger;

          router.push(toPath).catch( reason => {
            console.error("Redirect failed!", reason);
          });
          return false;   // false: Firebase UI should not redirect
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

    /*** Q: is this worth keeping??
    // Decision: what auth state persistence does your app favor?
    // See -> https://firebase.google.com/docs/auth/web/auth-state-persistence?hl=fi
    //
    // tbd. This could be driven from 'config.js'
    //
    // 'Persistence.SESSION': "Existing and future Auth states are now persisted in the current session only.
    //                        Closing the window would clear any existing state even if a user forgets to sign out."
    //                        (source: FirebaseUI sources)
    //
    try {
      await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
    }
    catch (err) {
      console.error('Error in \'.setPersistence\'', error.code, error.message);
    }
    console.debug("Persistence changed")    // we don't really care, do we?
    ***/

    return uiConfig;
  });

  export default {
    name: 'SignIn',
    setup() {
      onMounted(async () => {
        const ui = new firebaseui.auth.AuthUI( firebase.auth() );
        ui.start("#firebaseui-container", await uiConfigProm);
      })
      return {}   // nothing to expose
    }
  }
</script>
