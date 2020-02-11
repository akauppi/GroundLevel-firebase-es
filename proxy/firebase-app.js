/*
* proxies/firebase-app.js
*
* Reverse-engineered from 'firebase', 'firebaseui' and '@firebase/app' npm sources, to tie npm 'firebaseui' to use
* the CDN-loaded Firebase as its peer dependency.
*
* Rollup config is with us on this, passing `import 'firebase/app'` to us.
*/

// Actual code seems to need: initializeApp, app, auth

/*** Using CDN (index.html) ***/
/*** Using npm ***/
//import '@firebase/app';
//import '@firebase/auth';

if (!firebase) throw "Expected 'firebase' to be loaded!";
if (!firebase.app) throw "Expected 'firebase.app' to be loaded!";
if (!firebase.auth) throw "Expected 'firebase.auth' to be loaded!";   // looks like 'firebaseui' wants it from us (weird)
if (!firebase.initializeApp) throw "Expected 'firebase.app' to be loaded!";

export const app = firebase.app;
export const auth = firebase.auth;
export const initializeApp = firebase.initializeApp;
