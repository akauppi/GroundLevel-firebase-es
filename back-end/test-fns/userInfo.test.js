/*
* back-end/test-fns/userInfo.test.js
*
* Test that '/projectsC/.../userInfoC' gets updated, by cloud functions, when the global '/userInfoC' changes (if
* users are in the project).
*/
import { test, expect, describe, beforeAll, afterAll } from '@jest/globals'

import { db } from 'firebase-jest-testing'
import { eventually } from "firebase-jest-testing/eventually"

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
    console.error("Initialization failed:", err);   // not seen in wild
    throw err;
  }
});

async function wipe(collection) {   // CollectionReference => Promise of ()
  const qss = await collection.get();
  const proms = qss.docs.map( qdss => {
    return qdss.ref.delete()
  } );
  await Promise.all(proms);
}

/*
* Cleanup
*/
afterAll( async () => {
  await db.app.delete();
});

describe("userInfo shadowing", () => {

  // During execution of the tests, collect changes to 'projects/1/userInfo/{uid}' here:
  //
  const shadow = new Map();   // { <uid>: { ... } }

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  let unsub;

  beforeAll( () => {
    unsub = db.collection("projects/1/userInfo")
      .onSnapshot(qss => {    // intention is enough (write to cache)
        qss.forEach( qdss => {
          //console.debug("Sniffed:", qdss);
          shadow.set( qdss.id, qdss.data() );
        })
      });
  });

  afterAll( () => {
    unsub();
  });

  // Note: We don't declare 'async done => ...' for Jest. That is an oxymoron: only either 'done' or the end of an
  //    async/await body would resolve a test but not both.
  //
  test('Central user information is distributed to a project where the user is a member', async () => {
    const william = {
      name: "William D.",
      photoURL: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Dalton_Bill-edit.png"
    };

    // Write in 'userInfo' -> causes Cloud Function to update 'projectC/{project-id}/userInfo/{uid}' -> ’shadow’ changes
    //
    await db.collection("userInfo").doc("abc").set(william);

    await expect( eventually( _ => shadow.get("abc") ) ).resolves.toContainObject(william);
  });

  test('Central user information is not distributed to a project where the user is not a member', async () => {

    // Write in central -> should NOT turn up
    //
    await db.collection("userInfo").doc("xyz").set({ name: "blah", photoURL: "https://no-such.png" });

    await sleep(200).then( _ => expect( shadow.keys() ).not.toContain("xyz") );    // should pass

  }, 500 /*ms*/ );
});
