/*
* adapters/logging/googleCloudLogging.js
*
* Try to log to Cloud Logging *directly* from the browser.
*
* This would be the sensible way; not really aware why Cloud Logging does not seem to allow/push for it.
*/

// NOTE: Cloud Logging does NOT have a browser client. We're using the node.js library (heard it might work..).
//
import { Logging } from '@google-cloud/logging'

import { projectId } from '/@src/main'

const logging = new Logging({projectId});

function createLogger(name) {    // (String) => { log(...) }

  // Q: Does the Cloud Logging client have offline support / batching?

  console.warn("Not providing proper auth for '@google-cloud/logging' client - likely won't work (but trying the APIs)." );

  const appLog = logging.log(name);

  function log(level, msg, payload) {   // ("debug"|"info"|"warn"|"error"|"fatal", string, object?) => ()

    const t = Date.now();   // time now, in Epoch ms's

    /*** not yet (feature pending)
     if (pending.length < maxBatchSize) {
      pending.push({level, msg, t, payload});
    } else {
      // tbd. give once a console warning about exceeding the limit
    }
     ***/

    const severity = severityMap.get(level);
    if (!severity) {
      throw new Error(`Application code uses an unknown logging level: ${level}`);
    }

    const le = appLog.entry({
      severity,
      //labels
      //resource: { type: 'global' }
    }, {
      //...payload,   // tbd. where to ship these?
      //created: t,
      message: msg
    });

    appLog.write(le);
  }

  return {
    log
  }
}

const severityMap = new Map([
  ['debug', 'DEBUG'],
  ['info', 'INFO'],
  ['warn', 'WARNING'],
  ['error', 'ERROR'],
  ['fatal', 'CRITICAL']
]);

export {
  createLogger
}

