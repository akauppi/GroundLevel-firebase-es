/*
* src/app.js
*
* Application entry point.
*
* When we get here:
*   - Firebase is initialized
*   - 'assert' is available, as a global
*/
import { createApp } from 'vue'

import { appTitle } from './config.js'

import { central, testDebug, testInfo, testWarn, testError } from './central.js'

import App from './App.vue'
import { routerProm } from './router.js'

document.title = appTitle;

// Note: 'import.meta.env' is defined only under Vite; with Rollup 'import.meta.env' is undefined.
const _MODE = import.meta.env?.MODE ?? 'production';

const app = createApp(App, { mode: _MODE });

/*** JUST TESTING ***/
if (true) {
  central( testDebug, "This is a DEBUG test.");
  central( testInfo, "This is a INFO test.");
  central( testWarn, "This is a WARNING test.");
  central( testError, "This is an ERROR test.");
}

/*** tbd. enable
app.config.errorHandler = (err, vm, info) => {

  // tbd. Airbreak allows shipping an 'Error' directly: see -> https://github.com/airbrake/airbrake-js/tree/master/packages/browser#basic-usage
  logs.error("Vue error:", {err, vm, info});   // tbd. tune
}

if (!_MODE !== "production") {   // 'warnHandler' "only works during development"

  app.config.warnHandler = (msg, vm, trace) => {
    logs.warn("Vue warning:", {msg, vm, trace});    // tbd. tune
  }
}
***/

(async () => {    // until we have top-level-await
  const router = await routerProm;
  app.use(router)
    .mount('#app');
})();
