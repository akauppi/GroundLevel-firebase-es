/*
* src/main.js
*
* The entry point.
*/
import { createApp } from 'vue';

//import { logSome } from './sentry/logSome.js';

import App from './App.vue';
import router from './router.js';
import c from './config.js'; const { analytics } = c;

/* not yet...
import 'jquery';    // for Bootstrap, before it
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
*/

//logSome( "Launching" );

createApp(App)
  .use(router)
  .mount('#app');


/*** Note: with Vue 2.x we had this - what's a similar way with Vue 3 (beta)? Do we need this?
 *
  renderError: (h, err) => {  // pour runtime problems on the screen, if we have them (may help in development);
                              // in production we may want to pour these to central monitoring
    return h('pre', { style: { color: 'red' }}, err.message)    // has 'err.stack'
*/
