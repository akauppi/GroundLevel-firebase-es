/*
* fns-test/userInfo.test.js
*
* Test that '/projectsC/.../userInfoC' gets updated, by cloud functions, when the global '/userInfoC' changes (if
* users are in the project).
*/
import { test, expect, describe, beforeAll, afterAll } from '@jest/globals'

import { db } from './tools/firebase.js'
import { bestBeforePromise } from "./tools/promiseTools.js"

import './matchers/toContainObject'

// Clear '/projects/1/userInfo/abc'
//
// Note: Since we leave the end result of running tests in the server, this is needed in case (in dev) the test is
//    run multiple times.
//
beforeAll( async () => {    // takes about 456, 419 ms

  try {
    await db.doc("projects/1/userInfo/abc").delete();    // left-overs from earlier tests - maybe

    // Delete all "userInfo/*"
    await wipe( db.collection("userInfo") );
  }
  catch(err) {
    console.error("Initialization failed:", err);
    throw err;    // tbd. how to NOT run tests if 'beforeAll' fails? #jest
  }
});

/*
* Cleanup
*/
afterAll( async () => {
  await db.app.delete();
});

describe("userInfo shadowing", () => {

  // Note: We don't declare 'async done => ...' for Jest. That is an oxymoron: only either 'done' or the end of an
  //    async/await body would resolve a test but not both.
  //
  test('Central user information is distributed to a project where the user is a member', async () => {
    const william = {
      name: "William D.",
      photoURL: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Dalton_Bill-edit.png"
    };

    const exProm = bestBeforePromise({ timeoutMs: 2000 });    // { promise: Promise, resolve: () => (), reject: () => () }

    // Prepare a watch
    //
    const unsub = db.collection("projects/1/userInfo").doc("abc")
      .onSnapshot(dss => {    // enough to see the intention (write to cache)
        const o = dss.data();
        //console.debug("Noticed: ", o);   // DEBUG

        if (o) {   // 'undefined' on first call (initially no doc)
          expect(o).toContainObject(william);
          exProm.resolve();   // stop the wait
        }
      });

    // Write in central -> should cause Cloud Functions to update the above (but not immediately)
    //
    await db.collection("userInfo").doc("abc").set(william);

    try {
      await exProm;   // resolved by the database change or rejected by timeout
    }
    finally {
      unsub();    // tbd. is this the best place? (does it always get called?)
    }
  });

  test('Central user information is not distributed to a project where the user is not a member', async () => {
    const exProm = bestBeforePromise({ timeoutMs: 200, onTimeout: () => true });

    // Prepare a watch (should NOT get called!)
    //
    const unsub = db.collection("projects/1/userInfo").doc("xyz")
      .onSnapshot(dss => {    // enough to see the intention (write to cache)
        const o = dss.data();
        if (o) {  // 'undefined'|obj
          console.debug("Not expecting visitors...", o);   // DEBUG
          exProm.resolve(false);    // shouldn't have reached here; cuts the wait
        }
      });

    // Write in central -> should NOT cause the above to happen
    //
    await db.collection("userInfo").doc("xyz").set({ name: "blah", photoURL: "https://no-such.png" });

    // Resolves to true|false
    expect(await exProm).toBe(true);
    unsub();
  });
});

// tbd. move to 'tools/'
/*
* Delete all (prior) documents from a collection.
*/
async function wipe(collection) {   // CollectionReference => Promise of ()

  const qss = await collection.get();
  const proms = qss.docs.map( qdss => {
    //console.debug("Deleting:", collection.id +"/"+ qdss.id);
    return qdss.ref.delete()
  } );
  await Promise.all(proms);
}
