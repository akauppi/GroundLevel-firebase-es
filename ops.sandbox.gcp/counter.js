/*
* counter.js
*
* Distributed counter.
*/
import { v3 } from "@google-cloud/monitoring";
  const { TimeSeries } = v3;

/*
* Create a 'CUMULATIVE' time series entry
*/
function tsGen_CUMULATIVE_DOUBLE( name, tsMs, diff, labels ) {   // (string, number, number, { [string]: string }) => google.monitoring.v3.TimeSeries

  diff >= 0 || fail(`Bad argument (must be >= 0): ${v}`);

  const tsSecs = tsMs / 1000;

  // Note: 'CUMULATIVE' type seems to need both 'points[].interval.startTime' and '..endTime', which needs to be at least
  //    1s behind the start time. (otherwise, errors occur; Aug 2022)
  //
  const o = {   // ITimeSeries
    metric: {     // IMetric | null
      type: `custom.googleapis.com/app/${name}`,
      labels: labels || null
    },

    resource: {   // IMonitoredResource | null
      type: 'global',
      labels
    },

    //metadata: {     // IMonitoredResourceMetadata | null
    //  systemLabels: ...
    //  userLabels: ...
    //},

    metricKind: 'CUMULATIVE',
      // "GAUGE" | "DELTA" | "CUMULATIVE"

    valueType: 'DOUBLE',
      // "BOOL" | "INT64" | "DOUBLE" | "STRING" | "DISTRIBUTION" | "MONEY"

    points: [{   // IPoint
      interval: {
        startTime: { seconds: tsSecs },
        endTime: { seconds: tsSecs+1 }
      },
      value: { doubleValue: diff }
    }],

    //unit: null    // string (according to certain syntax) | null
  };

  return o; // TimeSeries.create(o);
}

export {
  tsGen_CUMULATIVE_DOUBLE
}

function fail(msg) { throw new Error(msg) }
