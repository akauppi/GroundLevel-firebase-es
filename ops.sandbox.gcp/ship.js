/*
* Exercise Cloud Monitoring, from command line.
*
* Can be used to test new approaches, on actual Firebase project, without disturbing 'packages/' folders.
*
* References:
*   - "Create custom metrics with the API"
*     -> https://cloud.google.com/monitoring/custom-metrics/creating-metrics
*   - Write metric data
*     -> https://cloud.google.com/monitoring/docs/samples/monitoring-write-timeseries
*   - Cloud Monitoring > MetricDescriptor
*     -> https://cloud.google.com/monitoring/api/ref_v3/rest/v3/projects.metricDescriptors#MetricDescriptor
*   - MetricServiceClient (API docs)
*     -> https://cloud.google.com/nodejs/docs/reference/monitoring/latest/monitoring/v3.metricserviceclient
*/
import { MetricServiceClient } from "@google-cloud/monitoring";

const client = new MetricServiceClient();

function fail(msg) { throw new Error(msg) }

// Currently, the metrics are passed to the same GCP project as the Firebase Functions are running under.
// This can be changed, however, to aggregate multiple Firebase app's metrics (and logs) into a single project.
//
const PROJECT_ID = process.env["GCLOUD_PROJECT"] || fail("No 'GCLOUD_PROJECT' env.var");

import { tsGen_CUMULATIVE_DOUBLE } from './counter.js'
import { tsGen_DISTRIBUTION } from './distribution.js'

const arr = [
  tsGen_CUMULATIVE_DOUBLE("fake_counter", Date.now(), 12, /*{ fake: true }*/),

  tsGen_DISTRIBUTION("fake_dist", Date.now(), {   // IDistribution
    count:
    mean:

  })
];

//--- Bake into one request
//
const request = {
  name: client.projectPath(PROJECT_ID),
  timeSeries: arr,
};

await client.createTimeSeries(request);   // writes

await client.close();
