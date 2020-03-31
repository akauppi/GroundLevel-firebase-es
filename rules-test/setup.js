/*
* rules-test/setup.js
*
* Set up the Rules emulation session, including bringing in data.
*/
import { session } from './tools/guarded-session';
import { data } from './data';

// One emulator session is enough
//
// The session id (Firebase calls it 'project id') used by the emulator. Also needed for seeing coverage reports.
//
// WARNING: Firebase docs (link please!) state that sessions persist on a single emulator run, but this doesn't seem to hold in
//    practise. They survive an emulator restart. What's up?
//    ->
//
const sessionId = `test-${Date.now()}`;
const sessionProm = session(sessionId, data);    // Promise of 'firebase.firestore.CollectionRef' -like

// Show this for Test Reports (coverage)
console.info("Emulation session:", sessionId);

function globalCleanup() {    // () => Promise of ()
  console.debug("Cleaning up:", sessionId);
  sessionProm
      .then( session => session.release() )
      //.then( _ => { console.debug("Cleaned up:", sessionId); return _; } );   // DEBUG (no more logging in the exit promise :)
}

export {
  sessionProm,
  globalCleanup
}
