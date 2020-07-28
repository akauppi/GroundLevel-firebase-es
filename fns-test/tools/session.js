/*
* fns-test/tools/session.js
*
* Tools to:
*   - prime emulated Firestore with data (called from 'globalSetup')
*   - access that primed data in tests
*
* Usage:
*   - call 'primeSession(sessionId, data)' from a 'globalSetup' Jest context; once
*   - import 'db' to get a handle to the primed data
*
* Note: The priming and use get called in different Jest context. Therefore, we cannot pass a value via a JavaScript
*     variable. Luckily, the OS environment is common to both (but this *may* change in future Jest implementations
*     - if that happens, consider providing the session name from the calling 'npm' script.
*/
import { strict as assert } from 'assert'

import * as firebase from 'firebase'

const ENV_KEY = 'SESSION_ID';

const PRIME_ROUND = !global.afterAll;  // true: called from 'globalSetup'

const FIRESTORE_HOST = "localhost:6768";

let app;

/*
* Initialize access to Firestore and provide a handle. Common for both prime and tests.
*/
function getDb(sessionId) {
  app = firebase.initializeApp({
    projectId: sessionId,
    auth: null    // unauth is enough
  });

  const db = firebase.firestore();
  db.settings({         // affects all subsequent use (and can be done only once)
    host: FIRESTORE_HOST,
    ssl: false
  });

  return db;
}

/*
* Prime a database with data
*/
let primeSession;
if (PRIME_ROUND) {
  primeSession = async (sessionId, data) => {    // (string, { <docPath>: { <field>: <value> } }) => Promise of ()
    const db = getDb(sessionId);

    /*** Cannot do without coding. Let's see.
    // Remove all the data (in case there's a static session id)
    //
    const t0 = process.hrtime();
    await firebase.clearFirestoreData({ projectId: sessionId });

    console.debug( "Clearing took:", toMillis(process.hrtime(t0)) + " ms");   // 41ms, 55ms
    ***/

    const batch = db.batch();

    for (const [docPath,value] of Object.entries(data)) {
      batch.set( db.doc(docPath), value );
    }
    await batch.commit();

    const ignore = app.delete();   // clean the app, data remains [2ms]; left as a free-running tail
    app= null;

    // Set env.var. so test suites know it; this way, they all run against one session in Firebase.
    //
    process.env[ENV_KEY] = sessionId;   // our imports from tests (one per suite) read it from here
  }
}

/*
* Make a new session to run Jest tests.
*
* Note: Security Rules are *not* a concern in running tests about background functions. We provide full read/write
*     access to the test scripts.
*/
let db;
if (!PRIME_ROUND) {    // called from a test script
  const sessionId = process.env[ENV_KEY];   // defined for test suites, if 'prime...()' was properly called
  if (!sessionId) {
    throw(`Internal problem: '${ENV_KEY}' was not set! 😱`)
  }

  console.debug("Using session: ", sessionId);

  db = getDb(sessionId);

  /***
  afterAll( () => {   // needed, harmful?? tbd.
    app.delete();
  });
  ***/
}

function toMillis([secs,nanoseconds]) {
  return secs*1000 + nanoseconds/1e6;
}

export {
  primeSession,
  db
}
