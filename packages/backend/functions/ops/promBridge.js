/*
* functions/ops/promBridge.js
*
* At regular intervals:
*   - see, whether there are new metrics in Realtime Database
*   - if yes, ship them
*
* Note: This is a separate function from lokiBridge, since these two use different APIs.
*/
import { onSchedule } from 'firebase-functions/v2/scheduler'

import { defineString, defineSecret } from 'firebase-functions/params'

// These are set at (first) deployment; need '.value()' to be accessed within runtime load.
//
const confPromUserId = defineString('PROM_USER_ID', { description: 'Prometheus user id'});
const confMetricsApiKey = defineSecret('METRICS_API_KEY');    // no description for secrets?? tbd.

//import { region_v2 } from '../config.js'

// Note: At the time of writing (Oct 2022; firebase-functions 4.0.1), "task functions" offers region, secrets, cpu and
// memory parameters whereas "scheduled functions" doesn't.
//
// According to [1], "scheduled functions" are already supported in v2 public preview.
//
//    [1]: https://groups.google.com/g/firebase-talk/c/vopgpPCphog
/*
* NOTE!!!
*
* v2 'onSchedule' (as of 27-Oct-22) lacks these options (that Cloud Task options has):
*   <<
*     maxInstances: 1,    // make sure that tasks should never run in parallel: important for moving the "marker"
*     concurrency: 1,
*
*     cpu: 0.5,   // (what would be the default, here???)
*     memory: '512MiB',
*
*     region: region_v2,
*
*     secrets: ["METRICS_API_KEY"]      // tbd. when would we use a secret like so?  Where is it placed?????
*   <<
*
*   This page [2] states that "scheduled functions" is not yet available for v2, but the code itself (firebase-functions
*   4.0.1) has the package. Maybe it's half baked??
*
*     "Currently available Cloud Functions triggers" [2]
*       -> [https://firebase.google.com/docs/functions/beta#currently_available_triggers] states
*/

/*
* EXP:
*   - Access secrets
*   - Access non-secrets
*   - Run on a schedule
*   - Decide the CPU and memory requirements
*   - Restrict to a single run at any one time
*/
const promBridge = onSchedule({
  schedule: "every 5 minutes",

  retryCount: 1,    // "number of retry attempts for a failed run"

  //maxRetrySeconds: 60,    // "time limit for retrying" (does it mean: don't retry after this??) (default: ???)

  }, async data => {

  // Q: How to read the requested secret??

  console.log("!!! RUNTIME:", process.env);

  console.log("!!!", {
    promUserId: confPromUserId.value(),
    metricsApiKey: confMetricsApiKey.value() .slice(0,15)
  })
});

export {
  promBridge
}
