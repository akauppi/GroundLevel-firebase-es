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
const assert = require('assert').strict;

const firebase = require('@firebase/testing');

import { Mutex } from './mutex'

const MY_KEY = 'SESSION_ID';

/*
* Prime a database with data
*
* Note: It is enough to call this once, per Jest test run (via 'globalSetup').
*
* Note: This and 'session' get called in different Jest context. Therefore, it's useless to store a value for 'session'.
*     If we get called, it won't. If it gets called, this hasn't been.
*/
async function primeFromGlobalSetup(sessionId, data) {    // (string, { <docPath>: { <field>: <value> } }) => Promise of ()
  const fsAdmin = firebase.initializeAdminApp({
    projectId: sessionId
  }).firestore();

  if (!fsAdmin._settings.host.includes('localhost')) {    // just a safety feature, can be omitted
    throw "Please define 'FIRESTORE_EMULATOR_HOST' to point to a 'localhost' emulator instance"
  }

  const batch = fsAdmin.batch();

  for (const [docPath,value] of Object.entries(data)) {
    batch.set( fsAdmin.doc(docPath), value );
  }
  await batch.commit();

  await fsAdmin.app.delete();   // clean the app; data remains

  // Set env.var. so test suites know it; this way, they all run against one session in Firebase.
  //
  process.env[MY_KEY] = sessionId;   // our imports from tests (one per suite) read it from here
}

/*
* Make a new immutable session to run Jest tests.
*/
async function session() {    // () => Promise of Firestore-like
  const sessionId = process.env[MY_KEY];   // defined for test suites, if 'prime...()' was properly called
  if (!sessionId) { throw(`Internal problem: '${MY_KEY}' was not set! 😱`) };

  const fsAdmin = firebase.initializeAdminApp({
    projectId: sessionId
  }).firestore();

  // Unlike in the Firestore API, we allow authentication to be set after collection.
  //
  return {  // firebase.firestore.Firestore -like

    collection: (collectionPath) => ({   // (string) => { as: ... }
      as: (auth) => {   // ({ uid: string }|null) => firebase.firestore.CollectionReference -like
        return emul(sessionId, collectionPath, auth);
      }
    })
  };
}

/*
* We know how to clean up after ourselves. Runs after all the tests (once per each suite).
*/
if (typeof afterAll != "undefined") {   // skip in global setup
  afterAll( async () => {   // () => Promise of ()
    const proms = firebase.apps().map( app => app.delete() );
    await Promise.all(proms);
  });
}

//--- Private ---

/*
* Provide a 'firebase.firestore.DocumentReference'-like object to test Firestore Security Rules - without changing
* the data.
*
* Note: Getting both 'collectionPath' and 'auth' at once allows the middle API to decide, which way tests would like
*   to provide them. Firebase Firestore API requires auth first, then collection.
*
* Gotcha:
*   In reality, the change gets through. It is immediately revoked, but when multithreading tests, it could be that
*   some other thread gets the wrong data in-betwee. Let's see how this works in practise.
*/
function emul(sessionId, collectionPath, auth) {   // (string, string, { uid: string }|null) => 'firebase.firestore.CollectionReference' -like

  const collAdmin = firebase.initializeAdminApp({   // tbd. could be initialized in the upper level - same for all auths
    projectId: sessionId
  }).firestore().collection(collectionPath);

  const collAuth = firebase.initializeTestApp({
    projectId: sessionId,
    auth
  }).firestore().collection(collectionPath);

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
        get: () => {
          return SERIAL_op( "GET", adminD, () => authD.get().then( _ => null ), false /*no restore needed*/ );
        },
        set: (o) => {
          return SERIAL_op( "SET", adminD, () => authD.set(o) );
        },
        update: (o) => {
          return SERIAL_op( "UPDATE", adminD, () => authD.update(o) );
        },
        delete: () => {
          return SERIAL_op( "DELETE", adminD, () => authD.delete() )
        },

        _dump: () => {
          return SERIAL_op( "GET", adminD, () => authD.get().then( snap => snap.data() ), false /*no restore needed*/ );
        },
      }
    }
  };
}

/*
* Carry out one get/set/update/delete, preventing other operations from touching the same document, while we're in.
*
* Note: Locking has to happen on the global basis - two separate 'emul's may be stepping on each others' toes.
*/
const locks = new Map();   // { <collectionPath>: Mutex }

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
      if (DEBUG) console.trace('>> IN', opDebug, fullDocPath);
      was = restore && await adminD.get();   // false | firebase.firestore.DocumentSnapshot
      return await realF();
    }
    catch (err) {   // exceptions do get reported by the Jest matchers, so we don't need to.

      // Report non-evaluation exceptions, because they may be the root cause, e.g. (seen in the wild):
      //    >> Response deserialization failed: invalid wire type 7 at offset 8
      //
      if (err instanceof Object && err.name == "FirebaseError" && err.code == "permission-denied") {
        throw err;    // pass on
      } else {
        console.error("UNEXPECTED exception within Firebase operation", err);
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
          console.error("EXCEPTION within Firebase restore - restore may have failed!", err);
          locks = null;   // ban further tests!
          throw err;
        }
      }
      if (DEBUG) console.trace('<< soon out', fullDocPath);
    }
  });
}

export {
  primeFromGlobalSetup,
  session as sessionProm
}
