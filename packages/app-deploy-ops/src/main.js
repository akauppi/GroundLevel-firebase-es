/*
* src/main.js
*
* Entry point for production build.
*/
import { assert } from './assert.js'

import { initializeApp } from '@firebase/app'
import { firebaseProm } from './firebaseConfig'

import './catch'

// tbd. Find a way to differentiate between:
//    - running in a developer's maching ('npm run serve')
//    - production
//
//let stage = "???";

// Prepare all of Firebase, including performance monitoring (if enabled)
//
const initializedProm = firebaseProm.then( (o) => {
  const opts = { apiKey: o.apiKey, appId: o.appId, projectId: o.projectId, authDomain: o.authDomain };

  initializeApp(opts);
});

initializedProm.then( async _ => {    // free-running tail
  console.debug("Launching app...");

  const { init } = await import('@local/app');    // entry point
  await init();

  console.debug("App on its own :)");
});

export {};
