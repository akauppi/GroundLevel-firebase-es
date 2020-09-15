/*
* src/app.js
*
* Application entry point.
*
* When we get here:
*   - Firebase is initialized
*   - ops handling (error gathering, central logging) is initialized
*   - 'assert' is available, as a global
*/
import { createApp } from 'vue'

import { appTitle } from './config.js'

import {testDebug, testInfo, testWarn, testError, vueWarning} from './logging.js'

import App from './App.vue'
import { routerProm } from './router.js'

document.title = appTitle;

// Note: 'import.meta.env' is defined only under Vite; with Rollup 'import.meta.env' is undefined.
const _MODE = import.meta.env?.MODE || 'production';

console.debug("_MODE", _MODE);

const app = createApp(App, { mode: _MODE });

/*** JUST TESTING ***/
if (true) {
  central( testDebug, "This is a DEBUG test.");
  central( testInfo, "This is a INFO test.");
  central( testWarn, "This is a WARNING test.");
  central( testError, "This is an ERROR test.");
}

app.config.errorHandler = (err, vm, info) => {
  console.debug("Vue error:", {err, vm, info});

  central( vueError, "Vue error", {err, vm, info} );
  //fatal(err);

  // Send 'App' a message that an error has happened
}

if (!_MODE !== 'production') {   // 'warnHandler' "only works during development"

  app.config.warnHandler = (msg, vm, trace) => {
    console.warn("Vue warning:", {msg, vm, trace});

    central(vueWarning, "Vue warning", {msg, vm, trace});
  }
}

/*
* Exposing this to the ops allows more control than free-running tail. Maybe...
*/
async function init() {
  const router = await routerProm;
  app.use(router)
    .mount('#app');
}

export { init }
