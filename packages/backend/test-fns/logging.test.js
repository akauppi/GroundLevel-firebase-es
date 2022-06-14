/*
* test-fns/logging.test.js
*/
import { test, expect, describe } from '@jest/globals'

import { fnBeam } from 'common/beam.js'

const fail = (msg) => { throw new Error(msg) }

describe ('Can proxy application logs', () => {

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

    await fnLog(les);   // expecting no return value but failures of the callable are caught
  } );
});
  // DC (mac, DC 4.9.0):
  //  - no warm-up; cold emul:  5455 ms
  //  - warmed up; cold emul:     68 ms
  //
  // CI (DC):
  //  - no warm-up:              890, 1087 ms     # warm-up disabled by editing the DC yml
  //  - warmed up:                51, 44 ms

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

/*
* Call the callable to store a log entry.
*/
async function fnLog(les) {
  await fnBeam( les.map( o => ({ "":"log", ...o })) );
}
