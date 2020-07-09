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
  assert(firebase && firebase.auth);

  // tbd. Import FirebaseUI here, locally, one day. See -> https://github.com/akauppi/GroundLevel-es6-firebase-web/issues/18
  //import * as firebaseui from 'firebaseui'

  import { onMounted } from 'vue';
  import { allowAnonymousAuth } from '../config.js';

  function uiConfig(router, toPath) {   // (Router, String) => { ...firebaseui config }
    const cfg = {
      signInFlow: 'redirect',     // default (not popup)
      signInSuccessUrl: toPath,   // nope: we are SPA and want to avoid page refreshes
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
        signInSuccessWithAuthResult(authResult, redirectUrl) {
          // authResult: {
          //    credential: { ..., token: string, ... }
          //    operationType: "signIn"
          //    user: { displayName: string, ... }    // normal Firebase user object
          //    additionalUserInfo: { isNewUser: boolean, profile: { name: ..., granted_scopes: string }
          // }
          // redirectUrl: undefined

          // User successfully signed in
          console.log(toPath);

          router.replace(toPath).catch( reason => {
            console.error("Redirect failed!", reason);
          });
          return false;   // false: Firebase UI should not redirect
        },

        // Anonymous user upgrade: 'signInFailure' callback must be provided to handle merge conflicts which occur when
        // an existing credential is linked to an anonymous user.
        //
        signInFailure(error) {
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

    return cfg;
  }

  // Important this is in the root of the module, so 'AuthUI' gets initialized only once (instead of per page visit).
  //
  const ui = new firebaseui.auth.AuthUI( firebase.auth() );

  // Note: Getting 'routerProm' as a property (instead of importing) is vital for avoiding a cyclic dependency
  //    between 'router.js' and this module. While those are not illegal in ES, they do cause (unnecessary) warnings
  //    in Rollup, and are generally a source of unnecessary complexity.

  export default {
    name: 'SignIn',
    props: {
      final: String,        // URL query parameter: e.g. "..." | undefined
      routerProm: Object    // Promise of Router
    },
    setup(props) {
      onMounted(async () => {
        const {routerProm, final} = props;    // no need for reactivity: can use object destructuring

        const toPath = final || '/';
        console.log("Once signed in, we'd 🛵 to: " + toPath);

        ui.start("#firebaseui-container", uiConfig(await routerProm, toPath));
          // seems to be okay that we do '.start' multiple times (re-visiting the page)
      })
      return {}   // nothing to expose
    }
  }
</script>
