/*
* src/main.js
*
* The entry point.
*/
import { createApp } from 'vue';

import { appTitle } from './config.js';
import { logs } from './firebase/logs.js';

//--- Make-up 💄
/* not yet...
import 'jquery';    // for Bootstrap, before it
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
*/

// Exercise central logging
logs.info("We got up!");

document.title = appTitle;

import App from './App.vue';
import { routerProm } from './router.js';

routerProm.then( router => {
  createApp(App)
    .use(router)
    .mount('#app');
}).catch( ex => {
  console.error("Unable to get router:", ex);
});

/*** Note: with Vue 2.x we had this - what's a similar way with Vue 3 (beta)? Do we need this?
 *
  renderError: (h, err) => {  // pour runtime problems on the screen, if we have them (may help in development);
                              // in production we may want to pour these to central monitoring
    return h('pre', { style: { color: 'red' }}, err.message)    // has 'err.stack'
*/
