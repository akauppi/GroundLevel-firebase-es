/*
* src/app.js
*
* Application entry point.
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

routerProm.then(router => {
  createApp(App, {localMode: window.LOCAL})
    .use(router)
    .mount('#app');
}).catch(ex => {
  console.error("Unable to get router:", ex);
});
