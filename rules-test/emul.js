/*
* rules-test/emul.js
*
* Set up the Rules emulation, including bringing in data.
*/
import { setup } from './tools/setup';
import { data } from './data';

const assert = require('assert').strict;

// tbd. Should need to initialize the emulator instance only once
let emul;

const firebase = require('@firebase/testing');

const rulesFilename = 'dut.rules';    // NOTE: Keep in sync with what's in 'firebase.json'

beforeAll( async () => {    // set up all collections

  // The session id (Firebase calls it 'project id') used by the emulator. Also needed for seeing coverage reports
  //  -> http://localhost:6767/emulator/v1/projects/<session_id>:ruleCoverage.html
  //
  // Sessions persist on a single emulator run.(*!!) We use a date so that we'll get fresh stuff each run.
  //
  // (*!!): This is what Firebase docs say (link, please!), but in practise they seem to survive past
  //    emulator restarts. What's uP?
  //
  // Note: Tried with a static sessionId and got to problems, right away.
  //
  const sessionId = `test-${Date.now()}`;   // e.g. 'test-1583506734171'

  try {
    emul = await setup(sessionId, rulesFilename, data);
  }
  catch (err) {
    console.error( "Failed to initialize the Firebase emulator: ", err );
    throw err;
  }

  console.info("Emulation session: ", sessionId);
});

afterAll( async () => {    // clean up all collections (without this, the tests won't finish)
  assert(emul != undefined);
  await emul.teardown();
});

export {
  emul
}
