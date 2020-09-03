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

async function init() {    // called by 'index.html'

  const resp = await fetch('/__/firebase/init.json');
  if (!resp.ok) {
    console.fatal("Unable to read Firebase config:", resp);
    throw Error("Unable to read Firebase config (see console)");
  }

  // 'appId' is needed for Firebase Performance Monitoring
  //
  const { apiKey, appId, projectId, authDomain } = await resp.json();

  firebase.initializeApp({
    apiKey,
    appId,
    projectId,
    authDomain
  });

  // Initialize Performance Monitoring
  const perf = firebase.performance();

  // Dynamic import so that above gets first lick of Firebase. 🍭
  //
  import('./app.js');
}

// Note: When we can use top level 'await' in browsers, let's do it here. For now, it's a free-running tail. 🐕
//    track -> https://github.com/Fyrd/caniuse/issues/4978
//
/*await*/ init();

export { };
