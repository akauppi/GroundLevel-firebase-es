/*
* proxy/firebase-auth.js
*
* Reverse-engineered from 'firebase', 'firebaseui' and '@firebase/auth' npm sources, to tie npm 'firebaseui' to use
* the CDN-loaded Firebase as its peer dependency.
*
* Rollup config is with us on this, passing `import 'firebase/app'` to us.
*/
//import '@firebase/auth';

if (!firebase.auth) throw "Expected 'firebase.auth' to be loaded!";
