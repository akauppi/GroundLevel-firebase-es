/*
* rules-test/setup.js
*
* Set up the Rules emulation session, including bringing in data.
*
* https://dmitripavlutin.com/javascript-module-import-twice/
*/
import { prime, session, tearDown as innerTearDown } from './tools/guarded-session';
import { data } from './data';

const assert = require('assert').strict;

// One emulator session is enough.
//
// Jest does not allow JavaScript level data exchange between its suites. However, we can use a process level env.var
// and pass the name of the Firestore session ("project id") between suites. This a) allows data to be set only once
// and b) keeps all the one run's tests affecting the same test results.

const MY_KEY = 'MY_SESSION_ID';

/*
* Prepare a session; prime its data. Call this from 'jest.setup.js' so it's done before the test suites.
*
* Sets the 'MY_SESSION_ID' env.variable (only used within this module, to communicate across separate Jest universes).
*/
async function prepare() {    // () => Promise of ()
  assert( process.env[MY_KEY] == undefined );

  const sessionId = `test-${Date.now()}`;   // e.g. 'test-1586358763978'
  process.env[MY_KEY] = sessionId;
  console.debug("Set to: ", sessionId);

  await prime(sessionId, data);

  //console.log('Firestore emulator session (project) id: ', sessionId);    // tbd.
}

async function tearDown() {    // () => Promise of ()
  assert( process.env[MY_KEY] );
  const sessionId = process.env[MY_KEY];

  await innerTearDown(sessionId);
  console.debug("Cleaned up:", sessionId);
}

async function sessionProm() {
  const sessionId = process.env[MY_KEY] || (() => { throw(`Internal problem: '${MY_KEY}' env.var. not set. 😤`) })();

  return await session(sessionId);    // Promise of 'firebase.firestore.CollectionRef' -like
}

export {
  prepare,
  sessionProm,
  tearDown
}
