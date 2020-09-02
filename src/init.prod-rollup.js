/*
* src/init.prod-rollup.js
*
* The entry point for production mode.
*
* See comments in 'src/init.vite.js'.
*/

// DOES NOT WORK but is according to npm firebase instructions:
//  <<
//    initializeApp is not exported by node_modules/firebase/app/dist/index.esm.js
//  <<
//
//import * as firebase from 'firebase/app';   // still fails with firebase 7.19.1
import firebase from 'firebase/app';    // works (but does not allow firebaseui from npm :( )
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

/*
* Set up globals
*
* Note: Needs to be set up in a block that does not import our app level code.
*/
function assert(cond, msgOpt) {
  if (!cond) {
    //debugger;   // allows us to see the 'call stack' in browser

    if (msgOpt) {
      console.assert(msgOpt);
      console.trace(msgOpt);
    }
    throw new Error(`Assertion failed: ${msgOpt || '(no message)'}`);
  }
}

assert(firebase.initializeApp);

// As long as loading Firebase via 'import' is shaky (also with Vite), let's place it as a global.
//
window.firebase = firebase;
window.assert = assert;

function init({ apiKey, projectId, authDomain }) {    // called by 'index.html'
  assert(apiKey && projectId && authDomain, "Missing Firebase pieces");

  firebase.initializeApp({
    apiKey,
    projectId,
    authDomain
  });

  // Check Firebase health
  // Note: This needs to be done here, not in 'main.js'. In there, the components will import Firebase before the
  //    main code.
  //
  try {
    const app = firebase.app();
    const features = ['auth','firestore','functions'].filter(feature => typeof app[feature] === 'function');
    console.log(`Firebase SDK loaded with: ${features.join(', ')}`);
  } catch (e) {
    // tbd. we might have some error banner UI, later
    console.error(e);
    alert('Error loading the Firebase SDK, check the console.');
  }

  // Dynamic import so that above gets first lick of Firebase. 🍭
  //
  import('./app.js');
}

export { init };
