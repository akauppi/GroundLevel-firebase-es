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
*     // Mayyyybe... Cloud Run by itself limits concurrency to 1. "Maximum concurrency must be set to 1." implies so.
*     //
*     maxInstances: 1,    // make sure that tasks should never run in parallel: important for moving the "marker"
*     concurrency: 1,
*
*     cpu: 0.5,   // (what would be the default, here???)
*                 // "for less than 1 CPU, specify a value from 0.08 to less than 1.00, in increments of 0.01" [2]
*
*     memory: '512MiB',   // "A minimum of 0.5 CPU is needed to set a memory limit greater than 512MiB."
*                         // "A minimum of 1 CPU is needed to set a memory limit greater than 1GiB."
*
*     region: region_v2,
*
*     secrets: ["METRICS_API_KEY"]      // tbd. when would we use a secret like so?  Where is it placed?????
*   <<
*
*   [2]: Cloud Run documentation (linked to by 'firebase deploy' output):
*     -> https://cloud.google.com/run/docs/configuring/cpu
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
