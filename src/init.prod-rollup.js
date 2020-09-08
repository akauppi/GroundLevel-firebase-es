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
import "firebase/performance";

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

async function initFirebase() {
  // Note: Don't think browsers can dynamically 'import' a JSON. This gives (Chrome 85):
  //  <<
  //    The server responded with a non-JavaScript MIME type of "application/json".
  //  <<
  //const json = await import('/__/firebase/init.json');    // NOPE

  const json = await fetch('/__/firebase/init.json').then( resp => {
    if (!resp.ok) {
      console.fatal("Unable to read Firebase config:", resp);
      throw Error("Unable to read Firebase config (see console)");
    } else {
      return resp.json();   // Promise of ...
    }
  });

  const { apiKey, appId, projectId, authDomain } = json;

  firebase.initializeApp({
    apiKey,
    appId,      // for Firebase Performance Monitoring
    projectId,
    authDomain
  });

  const perf = firebase.performance();
}

(async () => {
  // Ensure that 'app.js' has both ops and Firebase installed.
  //
  await Promise.all([initOps(), initFirebase()]);

  // Dynamic import so that it happens only once the above are resolved.
  //
  import('./app.js');   // free-running tail
})();

export { };
