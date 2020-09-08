/*
* src/app.js
*
* Application entry point.
*
* Where dev mode and production code combine. Firebase is initialized.
*/
import { createApp } from 'vue';

import { appTitle } from './config.js';

document.title = appTitle;

import App from './App.vue';
import { routerProm } from './router.js';
import { Notifier } from "@airbrake/browser";

const app = createApp(App, {localMode: window.LOCAL});

app.config.errorHandler = (err, vm, info) => {

  // tbd. Airbreak allows shipping an 'Error' directly: see -> https://github.com/airbrake/airbrake-js/tree/master/packages/browser#basic-usage
  logs.error("Vue error:", {err, vm, info});   // tbd. tune
}

if (!import.meta.env.MODE !== "production") {   // 'warnHandler' "only works during development"

  app.config.warnHandler = (msg, vm, trace) => {
    logs.warn("Vue warning:", {msg, vm, trace});    // tbd. tune
  }
}

(async () => {    // until we have top-level-await
  const router = await routerProm;
  app.use(router)
    .mount('#app');
})();
