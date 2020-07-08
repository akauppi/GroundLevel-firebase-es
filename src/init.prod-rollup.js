/*
* src/init.prod-rollup.js
*
* The entry point for production mode.
*
* See comments in [init.dev-vite.js](init.dev-vite.js).
*/

// DOES NOT WORK but is according to npm firebase instructions:
//  <<
//    initializeApp is not exported by node_modules/firebase/app/dist/index.esm.js
//  <<
//
//import * as firebase from 'firebase/app';
import firebase from 'firebase/app';    // works (but does not allow firebaseui from npm :( )
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

// Provide as a global until the 'import * as firebase' works.
window.firebase = firebase;

/*
* Set up globals
*
* Note: 'assert' must be set up in a block that does not import our app level code (or maybe it could be an import,
*     itself).
*/
function assert(cond) {
  if (!cond) {
    debugger;   // allows us to see the 'call stack' in browser
    throw "Assertion failed!";
  }
}

window.assert = assert

assert(firebase.initializeApp);

function init({ apiKey, projectId, locationId, authDomain }) {    // called by 'index.html'
  assert(apiKey && projectId && locationId);

  firebase.initializeApp({
    apiKey,
    projectId,
    locationId,
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
