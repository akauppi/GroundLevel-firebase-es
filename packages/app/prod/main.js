/*
* prod/main.js
*
* Production entry point.
*
* Responsible for:
*   - initializing Firebase
*   - calling main app
*/
import { initializeApp } from '@firebase/app'
import config from '/@firebase.config.json'

// Others can use 'getApp()' to get a handle
//
// Note: 'locationId' is not needed (or recognized!) by Firebase itself, but is anyways passed to 'httpsCallables'
//      (eg. adapters), via 'getApp()'.
//
initializeApp(config);

import('/@/app.js').then( _ => {
  console.log("handed over to 'app.js'")
})
