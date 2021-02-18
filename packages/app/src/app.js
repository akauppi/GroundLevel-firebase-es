/*
* src/app.js
*
* Application entry point.
*
* When we get here:
*   - Firebase is initialized
*   - ops handling (error gathering, central logging) is initialized
*/
import { createApp, ref } from 'vue'

import firebase from 'firebase/app'
import '@firebase/auth'

import { init as initAuth, onUserChange, isReadyProm as isReadyAuthProm } from '@akauppi/aside-keys'

import { appTitle } from './config.js'

import App from './App.vue'
import { router } from './router.js'    // initializes the router; important we have it!

import './common.css'
import { assert } from './assert'

document.title = appTitle;

const app = createApp(App);

const user = ref();   // 'undefined' until we get the first 'onUser' callback

const LOCAL = import.meta.env.MODE === 'dev_local';
const [apiKey, authDomain] = [import.meta.env.VITE_API_KEY, import.meta.env.VITE_AUTH_DOMAIN];

async function init() {
  assert(firebase.auth);

  const t0 = performance.now();

  // Initialize the authentication system
  //
  if (!LOCAL) {
    initAuth({ apiKey, authDomain });

    // tbd. we could use below 'onUser' and not need this separate Prom. #later
    //
    isReadyAuthProm.then( _ => {
      const dt = performance.now() - t0;
      console.log(`Authentication initialized (took ${ dt.toFixed(0) }ms)`);    // #later: candidate for ops analytics
    })

    // Tie the 'aside-keys' authentication to our Firebase application (allows us to be able to use services that
    // need authentication).
    //
    onUserChange( user => {
      if (user) {
        const { token } = user;

        firebase.auth().signInWithCustomToken(token)
          .then(_ /*userCred*/ => {
            console.log('Authenticated in app tier.');
          })
          .catch(err => {
            console.error("Failed to auth in default Firebase app:", err);
            throw err;
          });
      } else {
        firebase.auth().signOut();
      }
    });
  }

  // Initialize Vue Router
  //
  // Note:
  //  This is needed for any use of the router; not just for 'this.$route[r]'.
  //
  app.use(router);

  // Let's be curious and see whether there are ever errors from here:
  router.isReady().catch( err => {
    console.error("Router did not initialize:", err);
    throw err;
  });

  //tbd. revise the comment
  // Vue-router note:
  //    It may be that we need to wait for router to be ready. Check here -> https://next.router.vuejs.org/guide/migration/#all-navigations-are-now-always-asynchronous
  //
  // tbd. "block the app render" until authentication has been done.
  //
  //await router.isReady().then( _ => ... )

  app.mount('#app');
  central.info("App is mounted.");
}

export { init, user }
