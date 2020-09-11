/*
* back-end/test-fns/monitoring.test.js
*
* Test the central monitoring functions (logs etc.)
*/
import { test, describe } from '@jest/globals'

import { fns } from '@akauppi/firebase-jest-testing/cloudFunctions'

describe("monitoring functions", () => {
  const fnLogs = fns.httpsCallable('logs_v190720');

  //--- Logs ---

  test('should be able to log in multiple levels', async () => {

    await fnLogs({ level: "debug", msg: "0 debug", payload: { "_": 0} });
    await fnLogs({ level: "info", msg: "1 info", payload: {a: 1} });
    await fnLogs({ level: "warn", msg: "2 warn", payload: {b: 2} });
    await fnLogs({ level: "error", msg: "3 error", payload: {c: 3} });

    // Cannot test what emerged in the logs - do that manually.
  });
});
