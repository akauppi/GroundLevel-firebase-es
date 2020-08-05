/*
* fns-test/userInfo.test.js
*
* Test that '/projectsC/.../userInfoC' gets updated, by cloud functions, when the global '/userInfoC' changes (if
* users are in the project).
*/
import { strict as assert } from 'assert'

import { test, expect, describe, beforeAll, afterAll, jest } from '@jest/globals'

import { db } from './tools/session.js'
import { extTimeoutPromise } from "./tools/extPromise"

import './matchers/toContainObject'

import { performance } from 'perf_hooks'    // node.js


// Clear '/projects/1/userInfo/abc'
//
// Note: Since we leave the end result of running tests in the server, this is needed in case (in dev) the test is
//    run multiple times.
//
beforeAll( async () => {

  const t0 = performance.now();
  try {
    await db.doc("projects/1/userInfo/abc").delete();    // left-overs from earlier tests - maybe

    // Delete all "userInfo/*"
    await wipe( db.collection("userInfo") );
  }
  catch(err) {
    console.error("Initialization failed:", err);
    throw err;    // tbd. how to NOT run tests if 'beforeAll' fails? #jest
  }

  console.debug("Cleared earlier changes (if any). Took:", (performance.now() - t0).toFixed(2) + "ms")
});

afterAll( async () => {
  await db.app.delete();

  console.debug("Cleanup finished (leaving data changes in the database).")
});

// tbd. candidate for 'tools/'
// Wait 'ms', as a Promise
//
const waitMs = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("userInfo shadowing", () => {

  // Note: We don't declare 'async done => ...' for Jest. That is an oxymoron: only either 'done' or the end of an
  //    async/await body would resolve a test but not both.
  //
  test('Central user information is distributed to a project where the user is a member', async () => {
    const william = {
      name: "William D.",
      photoURL: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Dalton_Bill-edit.png"
    };

    const exProm = bestBeforePromise({ timeoutMs: 500 });    // { promise: Promise, resolve: () => (), reject: () => () }

    expect.assertions(1);

    // Prepare a watch
    //
    const unsub = db.collection("projects/1/userInfo").doc("abc")
      .onSnapshot(dss => {    // enough to see the intention (write to cache)
        const o = dss.data();
        console.debug("Noticed: ", o);   // DEBUG

        if (o) {   // 'undefined' on first call (initially no doc)
          expect(o).toContainObject(william);
          exProm.resolve();   // stop the wait
        }
      });

    // Write in central -> should cause Cloud Functions to update the above (but in some ms..)
    //
    await db.collection("userInfo").doc("abc").set(william);

    try {
      await exProm.promise;   // resolved by the database change; or timeout
    }
    finally {
      unsub();    // tbd. is this the best place? (does it always get called?)
    }
  });

  test('Central user information is not distributed to a project where the user is not a member', async () => {
    const exProm = bestBeforePromise({ timeoutMs: 500 });

    // Prepare a watch (should NOT get called!)
    //
    const unsub = db.collection("projects/1/userInfo").doc("abc")
      .onSnapshot(dss => {    // enough to see the intention (write to cache)
        const o = dss.data();

        if (o) {
          exProm.resolve(false);    // shouldn't have reached here
        }
      });

    // Write in central -> should NOT cause the above to happen
    //
    await db.collection("userInfo").doc("no-such").set({ name: "blah", photoURL: "https://hoax.png" });

    try {
      const v = await exProm.promise;   // rejected by (unwanted) database change (leads to failure of test) or resolved by timeout
      expect( v === undefined );    // timed out
    }
    finally {
      unsub();
    }
  });
});

/*
* Delete all (prior) documents from a collection.
*/
async function wipe(collection) {   // CollectionReference => Promise of ()

  const qss = await collection.get();
  const proms = qss.docs.map( qdss => {
    console.debug("Deleting:", collection.id +"/"+ qdss.id);
    return qdss.ref.delete()
  } );
  await Promise.all(proms);
}
