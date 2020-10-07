/*
* init/firebaseUi.js
*
* EXPERIMENTAL to try to load 'firebaseui' from npm, using Rollup.
*/

// Causes (at build time):
//  <<
//    auth is not exported by node_modules/firebase/app/dist/index.esm.js
//      ...
//    app is not exported by node_modules/firebase/app/dist/index.esm.js
//      ...
//    initializeApp is not exported by node_modules/firebase/app/dist/index.esm.js
//  <<
//
//import { auth } from 'firebaseui'
//const firebaseui = { auth };

// These crash the build:
//  <<
//    [!] (plugin prodIndex) TypeError: object null is not iterable (cannot read property Symbol(Symbol.iterator))
//  <<
//
//import 'firebaseui/dist/firebaseui.js'    // works; WORK-AROUND until real loading works
//import 'firebaseui/dist/firebaseui.css'   // needed; otherwise the login buttons look broken
//const firebaseui = window.firebaseui;

const firebaseui = window.firebaseui;   // provided in index.html (from CDN)  #byway

console.debug("firebaseui:", firebaseui);

export { firebaseui }
