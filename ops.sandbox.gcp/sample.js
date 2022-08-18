/*
* samples.js
*
* Samples collector, where samples represent sizes or time spans, with variation.
*/
import { v3 } from "@google-cloud/monitoring";
  const { TimeSeries } = v3;

/*
* Create a 'DISTRIBUTION' time series entry
*/
function tsGen_DISTRIBUTION( name, tsMs, v, labels ) {   // (string, number, number, { [string]: string }) => google.monitoring.v3.TimeSeries
  const tsSecs = tsMs / 1000;

  const o = {   // ITimeSeries
    metric: {     // IMetric | null
      type: `custom.googleapis.com/app/${name}`,
      labels: labels
    },

    resource: {   // IMonitoredResource | null
      type: 'global',
      labels
    },

    //metadata: {     // IMonitoredResourceMetadata | null
    //  systemLabels: ...
    //  userLabels: ...
    //},

    //metricKind: 'CUMULATIVE',
      // "GAUGE" | "DELTA" | "CUMULATIVE"

    valueType: 'DISTRIBUTION',
      // "BOOL" | "INT64" | "DOUBLE" | "STRING" | "DISTRIBUTION" | "MONEY"

    points: [{   // IPoint
      interval: {
        //startTime: { seconds: tsSecs },
        endTime: { seconds: tsSecs }
      },
      value: { doubleValue: diff }
    }],

    //unit: null    // string (according to certain syntax) | null
  };

  return o; // TimeSeries.create(o);
}

export {
  tsGen_DISTRIBUTION
}
