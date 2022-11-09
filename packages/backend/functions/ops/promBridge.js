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

import { region_v2 } from '../config.js'
import process from "node:process";

//---
// Application specific config (and/or secrets)
//
// Note: 'firebase-functions/params' offers an API to these, but - apart from type checking - it doesn't seem to offer
//    any added value over reading the environment, directly. One middle man less.
//
//import { defineString } from 'firebase-functions/params'
//
//const confPromUserId = defineString('PROM_USER_ID', { description: 'Prometheus user id'});
//const confLokiUserId = defineString('LOKI_USER_ID', { description: 'Loki user id'});
//const confMetricsApiKey = defineSecret('METRICS_API_KEY');    // no description for secrets?? tbd.
//
const promUserId = process.env["PROM_USER_ID"];
const lokiUserId = process.env["LOKI_USER_ID"];
const metricsApiKey = process.env["METRICS_API_KEY"];

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

  secrets: ["METRICS_API_KEY"],

  // Note: you can define 'cpu: "gcf_gen1"' and get the "Cloud Functions generation 1" behaviour (no parallelism,
  //    fractional CPU). Or we can be more specific.
  //
  cpu: 0.5,   // "for less than 1 CPU, specify a value from 0.08 to less than 1.00, in increments of 0.01" [2]

  memory: '512MiB',   // "A minimum of 0.5 CPU is needed to set a memory limit greater than 512MiB."
                      // "A minimum of 1 CPU is needed to set a memory limit greater than 1GiB."

  maxInstances: 1,
  concurrency: 1

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
