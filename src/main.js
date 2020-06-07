/*
* src/main.js
*
* The entry point.
*/
import { createApp } from 'vue';

import c from './config.js'; const { appTitle } = c;

//--- Make-up 💄
/* not yet...
import 'jquery';    // for Bootstrap, before it
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
*/

// Check Firebase health
try {
  const app = firebase.app();
  const features = ['auth'].filter(feature => typeof app[feature] === 'function');
  console.log(`Firebase SDK loaded with: ${features.join(', ')}`);
} catch (e) {
  // tbd. we might have some error banner UI, later
  console.error(e);
  alert('Error loading the Firebase SDK, check the console.');
}

document.title = appTitle;

import App from './App.vue';
import router from './router.js';

createApp(App)
  .use(router)
  .mount('#app');

/*** Note: with Vue 2.x we had this - what's a similar way with Vue 3 (beta)? Do we need this?
 *
  renderError: (h, err) => {  // pour runtime problems on the screen, if we have them (may help in development);
                              // in production we may want to pour these to central monitoring
    return h('pre', { style: { color: 'red' }}, err.message)    // has 'err.stack'
*/
