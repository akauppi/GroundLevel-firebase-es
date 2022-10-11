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

// DISABLED
//import { /*getPerformance*/ initializePerformance } from '@firebase/performance'

// Others can use 'getApp()' to get a handle
//
// Note: 'locationId' is not needed (or recognized!) by Firebase itself, but is anyways passed to 'httpsCallables'
//      (eg. adapters), via 'getApp()'.
//
/*const app =*/ initializeApp(config);

/** DISABLED
// EXPERIMENT: Let's see whether early import here causes "first paint" to be reported in Firebase dashboard.
//
// NOTE: Firebase Performance Monitoring API docs should state, what 'getPerformance' uses for the parameters.
//
initializePerformance(app, {
  dataCollectionEnabled: true,    // "whether to collect custom events"
  instrumentationEnabled: true    // "whether to collect out of box events"  <-- tbd. check, what that means?
})**/

// Using dynamic import so that 'app.js' (and its imports) can rely on Firebase app already having been created.
//
import('/@/app.js').then( _ => {
  console.log("handed over to 'app.js'")
})
