/*
* fns-test/monitoring.test.js
*
* Test the central monitoring functions (logs etc.)
*/
import { test, expect, describe, beforeAll, afterAll } from '@jest/globals'

import { fns } from './tools/firebase.js'

describe("monitoring functions", () => {
  let fnLogs, fnFatal;

  beforeAll( () => {
    fnLogs = fns.httpsCallable('logs_v190720');
    fnFatal = fns.httpsCallable('fatal_v210720');
  });

  //--- Logs ---

  test('should be able to log in multiple levels', async () => {

    await fnLogs({ level: "debug", msg: "0 debug", payload: { "_": 0} });
    await fnLogs({ level: "info", msg: "1 info", payload: {a: 1} });
    await fnLogs({ level: "warn", msg: "2 warn", payload: {b: 2} });
    await fnLogs({ level: "error", msg: "3 error", payload: {c: 3} });

    // Cannot test what emerged in the logs - do that manually.
  });

  //--- Fatal reporting ---

  test('should be able to report a fatal (unexpected code path) condition', async () => {

    await fnFatal({ msg: "Testing fatal", ex: new Error("abc") });

    // Again, check manually the outcome
  });
});
