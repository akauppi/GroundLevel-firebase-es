/*
* test-database/logging.test.js
*
* Logging is additive by its nature. That's why we don't care to clean up earlier left-overs. They don't matter for
* the tests.
*
* Note:
*   Since 'firebase-jest-testing' doesn't currently support Realtime Database testing, we just directly manipulate and
*   test the database with the admin tools. Works.
*/
import { test, expect, describe, beforeAll } from '@jest/globals'
import { strict as assert } from 'assert'

import { getDatabase, ServerValue } from 'firebase-admin/database'

import { dbAs } from './_support'

[false /*, true*/].forEach( dev => {
  const basePath = `logging_v0${ dev ? ":dev" : "" }`;

  describe (`/${basePath} rules`, () => {

    let unauth_loggingRef, abc_loggingRef, abc_anyRef;

    beforeAll( async () => {
      const dbUnauth = dbAs(null);
      const dbAbc = dbAs("abc");

      unauth_loggingRef = dbUnauth.ref(basePath);
      abc_loggingRef = dbAbc.ref(basePath);
      abc_anyRef = dbAbc.ref("any");

      await primeAsAdmin();
    });

    //--- Read rules ---

    // FAILS
    test .skip("no-one should be able to read", async () => {

      await expect( () => peekOne(abc_loggingRef) )
        .rejects.toThrowError();
    })

    //--- Write rules ---

    const msgs = [
      { /*level:'info',*/ msg:'Jack says hi!' },
      { /*level:'warn',*/ msg:'Avrell is hungry!', args: ["pie", "pumpkin"] },
      { /*level:'error',*/ msg:'William' },
      { /*level:'fatal',*/ msg:'Joe is in jail!' }
    ];

    // FAILS
    test .skip ("anonymous write should fail", async () => {

      await expect( () => pushOne( unauth_loggingRef, msgs[0] ) )
        .rejects.toThrowError();
    })

    // PASS
    test ('authenticated user can write (valid contents)', async () => {

      //await pushOne( abc_loggingRef, msgs[0] );     // just one, first..

      await Promise.all(msgs.map( m =>
        pushOne( abc_loggingRef, m )
      ));
    } )

    // FAILS
    test ('authenticated user cannot write invalid contents', async () => {

      await expect( () => pushOne( abc_loggingRef, { bogus: true } ) )
        .rejects.toThrowError();
    } )

    // FAILS
    test .skip ("no writing to random paths", async () => {

      await expect( () => pushOne( abc_anyRef, "anything" ) )
        .rejects.toThrowError();
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
  }); // describe
})

async function pushOne(ref, v) {    // (DatabaseRef, Any) => Promise of ()

  const x = await ref.push().set(v);    // undefined

  assert( x === undefined );
}

/*
* Try to return the first child within a collection, by the key.
*/
async function peekOne(ref) {    // (DatabaseRef) => Promise of Any|undefined

  const query = ref.orderByKey().limitToFirst(1);

  const dataSnapshot = await query.get();
  //console.log("!!!", { ref, query, exists: dataSnapshot.exists(), val: dataSnapshot.val() });

  return dataSnapshot.exists() ? dataSnapshot.val() : undefined;
}

/*** KEEP FOR NOW
* Write an initial value.
*/
async function primeAsAdmin() {   // tbd. might not be needed

  await getDatabase().ref("abc").push().set({
    at: clientNow(),
    atServer: ServerValue.TIMESTAMP,
    uid: "admin",
    msg: "Filling a gap?"
  });

} //**/

/*
* Return a time stamp, comparable to Firebase's server timestamp (ms since epoch).
*/
function clientNow() {    // () => number [ms]
  return Date.now();
}
