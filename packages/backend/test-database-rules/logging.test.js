/*
* test-database-rules/logging.test.js
*
* Logging is additive by its nature. Also, to test it, we don't need to be concerned about possible earlier
* contents. Just add on top.
*/
import { test, expect, describe, beforeAll, afterAll } from '@jest/globals'

import admin from 'firebase-admin'
import { getDatabase } from 'firebase-admin/database'

//const fail = (msg) => { throw new Error(msg) }

// Note: Having project ID _also_ in the 'databaseURL' is important. ONLY BY VISITING this website [1] did the author
//    get it to work.
//
//    [1]: https://github.com/urish/firebase-server/blob/master/docs/firebase-emulators.md
//
const projectId = "demo-2";   // tbd.
const databaseURL = `http://localhost:6800?ns=${projectId}`;

const cleanupApps = [];   // Array of FirebaseApp

describe ("/logging_v0 rules", () => {

  let unauth_loggingRef, abc_loggingRef, abc_anyRef;

  beforeAll( async () => {
    const dbUnauth = dbHandleAs(null);    // TEMPorarily hidden
    const dbAbc = dbHandleAs("abc");

    unauth_loggingRef = dbUnauth.ref("logging_v0");
    abc_loggingRef = dbAbc.ref("logging_v0");
    abc_anyRef = dbAbc.ref("random");

    // tbd. Is this needed?
    await primeAsAdmin()
  });

  afterAll( async () => {
    await Promise.all( cleanupApps.map( app => app.delete() ) );
  });

  //--- Read rules ---

  // Doesn't just fail because no access. Maybe needs a child in the 'logging_v0'? (we can prime it with one)
  //
  test .skip("no-one should be able to read", () => {     // tbd. finish this some day... (fails)

    expect( async () =>
      await peekOne(abc_loggingRef)
    ).toThrow();
  })

  //--- Write rules ---

  const msgs = [
    { level:'info', msg:'Jack says hi!' },
    { level:'warn', msg:'Avrell is hungry!', args: ["pie", "pumpkin"] },
    { level:'error', msg:'William' },
    { level:'fatal', msg:'Joe is in jail!' }
  ];

  test .skip("anonymous write should fail", () => {

    expect( async () =>
      await pushOne( unauth_loggingRef, msgs[0] )
    ).toThrow();
  })

  test('authenticated user can write', async () => {

    await pushOne( abc_loggingRef, msgs[0] );     // just one, first..

    /***await Promise.all(msgs.map( m =>
      pushOne( abc_loggingRef, m )
    ));***/
  } )

  test("no writing to random paths", async () => {

    await pushOne( abc_anyRef, "anything" );
  })

  /***
  // Enable this if you want to check emulator performance (it may be artificially throttled, even on short-running tests...).
  //
  // In practise, (on 2018 Mac Mini (Intel), Docker 4.9.0), we get ~50 writes/sec.
  //
  // Note: Firebase states that the emulator performance is artificially held back. This is not CPU bound.
  //
  test("can take 1000 logs, fast", async () => {
    const N = 100;
    const r = new Array(N).fill();    // testing 1000 would take ~21s

    const t0 = performance.now();

    await Promise.all( r.map( _ =>
      pushOne( abc_loggingRef, msgs[0] )
    ))

    const dt = performance.now() - t0;
    console.debug(`Sending ${N} logs took: ${dt}ms`);

    expect(dt) .toBeLessThanOrEqual(3000);    // would like 1000 writes/sec speeds
  })
  ***/
});

let appCount = 0;

/*
* Initialize a Firebase "app" (read: handle) for testing purposes, with a certain (imaginary) user id.
*/
function dbHandleAs(uid) {   // (string|null) => Database

  // In Jest setup, the 'FIREBASE_DATABASE_EMULATOR_HOST' env.var. has been set to "localhost:6800".
  //
  // Q: What is the relation of that, and the '.databaseURL' below?
  //    - removing '.databaseURL' leads to:
  //      <<
  //        Can't determine Firebase Database URL.
  //      <<
  //
  const app = admin.initializeApp({
    databaseURL,
    databaseAuthVariableOverride: { uid },
    projectId
  }, `app-${ appCount++ }`);

  cleanupApps.push(app);

  const db = getDatabase(app);
  return db;
}

async function pushOne(ref, v) {    // (DatabaseRef, Any) => Promise of ()

  const x = await ref.push().set(v);    // undefined

  expect(x).toBeUndefined();
}

/*
* Try to return the first child within a collection, by the key.
*/
async function peekOne(ref) {    // (DatabaseRef) => Promise of Any|null

  const query = ref.orderByKey().limitToFirst(1);

  const dataSnapshot = await query.get();

  return (dataSnapshot.exists()) ? dataSnapshot.val() : null;
}

/*
* Write an initial value.
*/
async function primeAsAdmin() {   // tbd. might not be needed

  // If '.databaseURL' is not given, even if 'BLAHBLAH' env.var. is, we get:
  //  <<
  //    Can't determine Firebase Database URL.
  //  <<
  //
  const adminApp = admin.initializeApp({
    databaseURL,
    projectId
  }, 'app-admin');

  const dbAdmin = getDatabase(adminApp);

  try {
    await dbAdmin.ref("logging_v0").push().set({
      at: 0,
      uid: "admin",
      msg: "Filling a gap?"
    });
  } finally {
    await adminApp.delete();
  }
}
