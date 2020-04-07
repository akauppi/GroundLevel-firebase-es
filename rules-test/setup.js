/*
* rules-test/setup.js
*
* Set up the Rules emulation session, including bringing in data.
*
* https://dmitripavlutin.com/javascript-module-import-twice/
*/
import { session } from './tools/guarded-session';
import { data } from './data';

// One emulator session is enough
//
// The session id (Firebase calls it 'project id') used by the emulator. Also needed for seeing coverage reports.
//
// Note: Once we'd have top level 'await' in the language, consider providing the importer a ready 'session', not just
//    a promise? #es10
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

export default sessionProm;   // done so to make every importer get the same copy
export {
  globalCleanup
}
