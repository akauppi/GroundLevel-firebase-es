/*
* test-fns/logging.test.js
*/
import { test, expect, describe } from '@jest/globals'

import { httpsCallable } from 'firebase-jest-testing/firebaseClientLike'

const fail = (msg) => { throw new Error(msg) }

describe ('Can proxy application logs', () => {

  const fnLog = httpsCallable("cloudLoggingProxy_v0");

  test('good log entries', async () => {
    const msgs = [
      { level:'info', msg:'Jack says hi!' },
      { level:'warn', msg:'Avrell is hungry!' },
      { level:'error', msg:'William' },
      { level:'fatal', msg:'Joe is in jail!' }
    ];

    const les = msgs.map(({ level, msg }) => {
      return createLogEntry(level, msg, []);
    });

    const { data } = await fnLog({ les });
    expect(data).toBe(true);
  } );
});
  // DC (mac):
  //  - no warm-up; cold emul:  1883 ms
  //  - warmed up; cold emul:    135, 114 ms
  //
  // CI (DC):
  //  - no warm-up:              890 ms     # warm-up disabled by editing the DC yml
  //  - warmed up:                51, 44 ms

// Copy-pasted from 'app-deploy-ops/adapters':
//
function createLogEntry(level, msg, args) {    // (string, string, Array of any) => LogEntry
  const severityLookup = new Map([
    ["info","INFO"],
    ["warn","WARNING"],
    ["error","ERROR"],
    ["fatal","CRITICAL"]
  ]);
  const severity = severityLookup.get(level) || fail(`Unknown logging level: ${level}`);

  const timestamp = new Date().toISOString();   // "2021-05-02T15:08:09.073Z"
  const jsonPayload = { msg, args };

  return {
    severity,
    timestamp,
    jsonPayload
  }
}
