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

import { region_v2, promUserId, metricsApiKey } from '../config.js'

// NOTE: This module is only imported, if the 'METRICS_API_KEY' secret is given, and non-empty.

/*
* Metrics (Prometheus) bridge.
*
* Shovel 'inc' and 'obs' metrics, fed in via web front ends, to Grafana Cloud.
*
* Note: These are hardly mission critical, so running the job e.g. every 10 minutes should be fine.
*
*     tbd. Make an observable itself about how long running the job took (can be done using Grafana Cloud logs).
*
* EXP:
*   - Access secrets
*   - Access non-secrets
*   - Run on a schedule
*   - Decide the CPU and memory requirements
*   - Restrict to a single run at any one time
*/
const promBridge = onSchedule({
  schedule: "every 5 minutes",
  region: region_v2,

  secrets: ["METRICS_API_KEY"],     // tbd. HOW TO USE SUCH A SECRET??

  // Note: you can define 'cpu: "gcf_gen1"' and get the "Cloud Functions generation 1" behaviour (no parallelism,
  //    fractional CPU). Or we can be more specific.
  //
  cpu: 0.5,   // "for less than 1 CPU, specify a value from 0.08 to less than 1.00, in increments of 0.01" [2]

  memory: '512MiB',   // "A minimum of 0.5 CPU is needed to set a memory limit greater than 512MiB."
                      // "A minimum of 1 CPU is needed to set a memory limit greater than 1GiB."

  maxInstances: 1,
  concurrency: 1

  //retryCount: 1,    // "number of retry attempts for a failed run"    Q: what does that mean? what do we want?

  // [2]: Cloud Run documentation (linked to by 'firebase deploy' output):
  //    -> https://cloud.google.com/run/docs/configuring/cpu

  }, async data => {

  console.log("!!!", {
    promUserId,
    metricsApiKey
  })
});

export {
  promBridge
}
