/*
* test-fns/userInfo.test.js
*
* Test that '/projectsC/.../userInfoC' gets updated, by cloud functions, when the global '/userInfoC' changes (if
* users are in the project).
*/
import { test, expect, describe, beforeAll, afterAll } from '@jest/globals'

import { dbUnlimited as db } from 'firebase-jest-testing/firestoreAdmin'

import './matchers/toContainObject'

describe("userInfo shadowing", () => {

  // During execution of the tests, collect changes to 'projects/1/userInfo/{uid}' here:
  //
  const shadow = new Map();   // { <uid>: { ... } }

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  test('Central user information is distributed to a project where the user is a member', async () => {
    const william = {
      displayName: "William D.",
      photoURL: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Dalton_Bill-edit.png"
    };

    // Listen to the shadow doc
    //
    const changedProm = waitForNextChange( db.doc("projects/1/userInfo/abc") );   // document contents, once changed

    // Write in 'userInfo' -> causes Cloud Function to update 'projectC/{project-id}/userInfo/{uid}' -> resolves the Promise
    //
    await db.collection("userInfo").doc("abc").set(william);

    await expect(changedProm).resolves.toContainObject(william);
  });    // 270, 268 ms

  test.skip('Central user information is not distributed to a project where the user is not a member', async () => {

    // Write in central -> should NOT turn up
    //
    await db.collection("userInfo").doc("xyz").set({ displayName: "blah", photoURL: "https://no-such.png" });

    await sleep(200).then( _ => expect( shadow.keys() ).not.toContain("xyz") );    // should pass

  }, 500 /*ms*/ );
});

/*
* Observe the given document
*
* Resolves:
*   - when the document changes the next time, with its contents as the value
*
* Note: This only checks for the next change. If you want, a predicate parameter can be added, to make it work as
*     eventual check (i.e. resolves only if the predicate becomes true, at some point before timeout).
*/
function waitForNextChange(docRef) {   // (documentRef) => Promise of { ..document from 'docPath'.. }
  return new Promise( (resolve) => {
    let count=0;

    const unsub = docRef.onSnapshot(dss => {
      if (count === 0) {    // initial value; not interested
        count = count+1;
        return;
      }

      const data = dss.data();  // first actual change
      unsub();
      resolve(data);
    });
  })
}
