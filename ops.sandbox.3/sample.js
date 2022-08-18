/*
* Sample from -> https://github.com/huksley/prometheus-remote-write
*
* Usage:
*   <<
*     $ GC_PUSH_URL=... \
*       GC_USER=... \
*       GC_API_KEY=... node sample.js
*   <<
*/
import { pushTimeseries, pushMetrics } from "prometheus-remote-write";

const GC_PUSH_URL=  process.env["GC_PUSH_URL"] || fail("Please provide 'GC_PUSH_URL' env.var.");
const GC_USER=      process.env["GC_USER"] || fail("Please provide 'GC_USER' env.var.");
const GC_API_KEY=   process.env["GC_API_KEY"] || fail("Please provide 'GC_API_KEY' env.var.");

fetch || fail("No native 'fetch'");

// Just push some metrics
await pushMetrics(
  {
    queue_depth_total: Math.floor(1000 * Math.random()),
  },
  {
    url: GC_PUSH_URL,
    labels: { service: "queue-worker" },
  }
);

// Full config - only url is required
const config = {
  url: GC_PUSH_URL,
  auth: {
    username: GC_USER,
    password: GC_API_KEY,
  },
  // Optional prometheus protocol description .proto/.json
  //proto: undefined,
  // Logging & debugging, disabled by default
  //console: undefined,
  fetch: fetch,   // use Node.js native 'fetch' (over node-fetch)
  // Additional labels to apply to each timeseries, i.e. { service: "SQS" }
  labels: { a: "12" }
};

// Follows remote_write payload format (see https://github.com/prometheus/prometheus/blob/main/prompb/types.proto)
await pushTimeseries(
  {
    labels: {
      __name__: "queue_depth_total",
      instance: "dev.example.com",
      service: "SQS",
    },
    samples: [
      {
        value: Math.floor(1000 * Math.random()),
        timestamp: Date.now(),
      },
    ],
  },
  { ...config,
    verbose: true,
    timing: true
  }
);
