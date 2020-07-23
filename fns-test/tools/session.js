/*
* fns-test/tools/session.js
*
* Tools to prime emulated Firestore with data, and for sharing that data across multiple Jest contexts.
*
* Usage:
*   - call 'primeFromGlobalSetup(sessionId, data)' from a 'globalSetup' Jest context; once
*   - call 'session(sessionId)' to get a handle to the session (can be called multiple times; from the test suites)
*/
import { strict as assert } from 'assert'
import * as firebase from '@firebase/testing'

const ENV_KEY = 'SESSION_ID';

const PRIME_ROUND = !global.afterAll;  // true: you can use 'primeSession'; false: you can use 'session'

/*
* Prime a database with data
*
* Note: This and 'session' get called in different Jest context. Therefore, we cannot pass a value to it, via a
*     JavaScript variable. Luckily, the OS environment is common to both (but this *may* change in future Jest
*     implementations - if that happens, consider providing the session name from the calling 'npm' script).
*/
async function primeSession(sessionId, data) {    // (string, { <docPath>: { <field>: <value> } }) => Promise of ()
  assert(PRIME_ROUND);

  const fsAdmin = firebase.initializeAdminApp({
    projectId: sessionId
  }).firestore();

  if (!fsAdmin._settings.host.includes('localhost')) {    // just a safety feature, can be omitted
    throw "Please define 'FIRESTORE_EMULATOR_HOST' to point to a 'localhost' emulator instance";
  }

  const batch = fsAdmin.batch();

  for (const [docPath,value] of Object.entries(data)) {
    batch.set( fsAdmin.doc(docPath), value );
  }
  await batch.commit();

  // Set env.var. so test suites know it; this way, they all run against one session in Firebase.
  //
  process.env[ENV_KEY] = sessionId;   // our imports from tests (one per suite) read it from here

  const t0 = process.hrtime();
  await fsAdmin.app.delete().then( _ => {    // clean the app, data remains
    //console.debug( `Deletion of data setup app: ${toMillis(process.hrtime(t0))} ms`);   // 2ms
  });
}

function getSessionId() {
  assert(!PRIME_ROUND);
  return process.env[ENV_KEY]   // defined for test suites, if 'prime...()' was properly called
    || (() => { throw(`Internal problem: '${ENV_KEY}' was not set! 😱`) })();
}

/*
* Make a new session to run Jest tests.
*/
function session() {    // () => Firestore-like
  const sessionId = getSessionId();
  console.debug("Using session: ", sessionId);

  // Unlike in the Firestore API, we allow authentication to be set after collection.
  //
  return {  // firebase.firestore.Firestore -like

    collection: collectionPath => ({   // string => { as: ... }

      as: auth => {   // { uid: string }|null => firebase.firestore.CollectionReference -like
        const collAuth = firebase.initializeTestApp({
          projectId: sessionId,
          auth
        }).firestore().collection(collectionPath);

        return collAuth;
      }
    })
  };
}

export {
  primeSession,
  getSessionId,
  session
}
