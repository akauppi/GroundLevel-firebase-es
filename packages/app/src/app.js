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

import App from './App.vue'
import { routerProm } from './router.js'

import './common.css'

document.title = appTitle;

const app = createApp(App);

/*
* Exposing this to the ops allows more control than free-running tail. Maybe...
*/
async function init() {
  const router = await routerProm;
  app.use(router)

  // Vue-router note: It may be that we need to wait for router to be ready. Check here -> https://next.router.vuejs.org/guide/migration/#all-navigations-are-now-always-asynchronous
  //
  // tbd. "block the app render" until authentication has been done.
  //
  await router.isReady();

  app.mount('#app');
  central.info("App is mounted.");
}

export { init }
