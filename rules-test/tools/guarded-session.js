/*
* rules-test/tools/guarded-session.js
*
* A data-immutable (semi; faked) session, for testing Cloud Firestore Security Rules, without altering
* the underlying data while doing so.
*
* Note: The data _does_ get altered; then immediately written back. We need to have locking to make sure
*   two tests don't mess with the same collection, at the same time.
*
*   Firebase wish: providing a 'dry-run' mode for running the emulator would simplify things. :) #🛎
*
* Usage:
*   - call 'primeFromGlobalSetup(sessionId, data)' from a 'globalSetup' Jest context; once
*   - call 'session(sessionId)' to get a handle to the session (can be called multiple times; from the test suites)
*/
import { strict as assert } from 'assert'
import * as firebase from '@firebase/testing'

import { Mutex } from './mutex'

const ENV_KEY = 'SESSION_ID';

const PRIME_ROUND = !global.afterAll;  // true: you can use 'primeSession'; false: you can use 'session'

/*
* Prime a database with data
*
* Note: It is enough to call this once, per Jest test run (via 'globalSetup').
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

  await fsAdmin.app.delete();   // clean the app; data remains

  // Set env.var. so test suites know it; this way, they all run against one session in Firebase.
  //
  process.env[ENV_KEY] = sessionId;   // our imports from tests (one per suite) read it from here
}

function getSessionId() {
  assert(!PRIME_ROUND);
  return process.env[ENV_KEY]   // defined for test suites, if 'prime...()' was properly called
    || (() => { throw(`Internal problem: '${ENV_KEY}' was not set! 😱`) })();
}

/*
* Make a new immutable session to run Jest tests.
*/
async function session() {    // () => Promise of Firestore-like
  const sessionId = getSessionId();

  // Unlike in the Firestore API, we allow authentication to be set after collection.
  //
  return {  // firebase.firestore.Firestore -like

    collection: collectionPath => {   // string => { as: ... }
      const collAdmin = firebase.initializeAdminApp({   // same for all auths
        projectId: sessionId
      }).firestore().collection(collectionPath);

      return {
        as: auth => {   // { uid: string }|null => firebase.firestore.CollectionReference -like
          const collAuth = firebase.initializeTestApp({
            projectId: sessionId,
            auth
          }).firestore().collection(collectionPath);

          return emul(collAdmin, collAuth);
        }
      };
    }
  };
}

/*
* We know how to clean up after ourselves. Runs after all the tests (once per each suite).
*/
if (!PRIME_ROUND) {   // skip in global setup
  //console.debug("Setting 'afterAll' hook");

  afterAll( async () => {   // () => Promise of ()
    await Promise.all( firebase.apps().map( app => { return app.delete(); }));
  });
}

//--- Private ---

/*
* Provide a 'firebase.firestore.CollectionReference'-like object to test Firestore Security Rules - without changing
* the data.
*
* Note: In reality, an accepted change gets through. It is immediately revoked, but for multithreading tests, access is
*     restricted to one Jest test at a time (even across contexts, since Firestore collections may cross reference
*     each other).
*/
function emul(collAdmin, collAuth) {   // (CollectionReference, CollectionReference, { uid: string }|null) => 'firebase.firestore.CollectionReference' -like

  return {    // firebase.firestore.CollectionReference -like object
    get: () => collAuth.get(),

    doc: (docPath) => {
      const authD = collAuth.doc(docPath);    // can be used for 'get'
      const adminD = collAdmin.doc(docPath);    // for reading & writing back

      return {  // firebase.firestore.DocumentReference -like object

        // Note: Also gets need to be locked, so that one test wouldn't write to a collection (and succeed) while
        //    another one reads.
        //
        //    We return 'Promise of ()' from 'get'; the purpose is just to test whether reads are allowed.
        //    Use '._dump()' to get the actual data (same as normal '.get().then( snap => snap.data() )').
        //
        get:    () => SERIAL_op( "GET", adminD, () => authD.get().then( _ => null ), false /*no restore needed*/ ),
        set:    o => SERIAL_op( "SET", adminD, () => authD.set(o) ),
        update: o => SERIAL_op( "UPDATE", adminD, () => authD.update(o) ),
        delete: () => SERIAL_op( "DELETE", adminD, () => authD.delete() ),
          //
        _dump:  () => SERIAL_op( "GET", adminD, () => authD.get().then( snap => snap.data() ), false )
      }
    }
  };
}

/*
* Carry out one get/set/update/delete, preventing other operations from touching the same document, while we're in.
*
* Note: Locking has to happen on the OS level basis - even globals is not enough, since multiple Jest suites can use
*     the same data (and will).
*/
const locks = new Map();   // { <collectionPath>: Mutex }   // tbd. this is NOT enough!!!
  //
  // tbd. also, WE CANNOT lock by collection boundary since security rules may cross-reference (just ONE BIG LOCK - by session id) :)

const DEBUG = false;  // switch tracing on/off

async function SERIAL_op(opDebug, adminD, realF, restore = true) {   // (string, DocumentReference, () => Promise of any, false|undefined) => Promise of any
  const fullDocPath = adminD.path;

  // In JavaScript, execution is not interrupted unless we use Promises so this should be atomic.
  //
  const m = locks.get(fullDocPath) || (() => {
    const tmp = new Mutex();
    locks.set(fullDocPath, tmp);
    return tmp;
  })();

  return m.dispatch( async () => {
    let was;
    try {
      if (DEBUG) console.debug('>> IN', opDebug, fullDocPath);
      was = restore && await adminD.get();   // false | firebase.firestore.DocumentSnapshot
      return await realF();
    }
    catch (err) {   // exceptions do get reported by the Jest matchers, so we don't need to.

      // Report non-evaluation exceptions, because they may be the root cause, e.g. (seen in the wild):
      //    >> Response deserialization failed: invalid wire type 7 at offset 8
      //
      if (/*err instanceof FirebaseError*/ err instanceof Object && err.code == "permission-denied") {
        throw err;    // pass on
      } else {
        console.fatal("UNEXPECTED exception within Firebase operation", err);
        throw err;
      }
    }
    finally {
      if (was) {
        try {
          const o = was.data();   // Object | undefined
          await o ? adminD.set(o) : adminD.delete();
        }
        catch (err) {
          console.fatal("EXCEPTION within Firebase restore - restore may have failed!", err);
          throw err;
        }
      }
      if (DEBUG) console.debug('<< soon out', fullDocPath);
    }
  });
}

export {
  primeSession,
  session as sessionProm
}
