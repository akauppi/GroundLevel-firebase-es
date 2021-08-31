/*
* test-fns/userInfo.test.js
*
* Test that '/projectsC/.../userInfoC' gets updated, by cloud functions, when the global '/userInfoC' changes (if
* users are in the project).
*/
import { test, expect, describe, beforeAll } from '@jest/globals'

import { collection, doc } from 'firebase-jest-testing/firestoreAdmin'

import './matchers/timesOut'
import './matchers/toContainObject'

describe("userInfo shadowing", () => {

  beforeAll( async () => {
    // Pre-heat also the client (cuts ~320ms off listening times for the stated collection). To show worst case times, skip it.
    preHeat("projects/1/userInfo");
  })

  test('Central user information is distributed to a project where the user is a member', async () => {
    const william = {
      displayName: "William D.",
      photoURL: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Dalton_Bill-edit.png"
    };

    // Write in 'userInfo' -> causes Cloud Function to update 'projectC/{project-id}/userInfo/{uid}'
    //
    await collection("userInfo").doc("abc").set(william);

    await expect( docListener("projects/1/userInfo/abc") ).resolves.toContainObject(william);
  });
    // native (macOS): 340, 388, 406 ms
    // DC (macOS):
    // CI (with DC): XXX

  test('Central user information is not distributed to a project where the user is not a member', async () => {

    // Write in 'userInfo' -> should NOT turn up in project 1.
    //
    await collection("userInfo").doc("xyz").set({ displayName: "blah", photoURL: "https://no-such.png" });

    await expect( docListener("projects/1/userInfo/xyz" )).timesOut(400);

    // ideally: await expect(prom).not.toComplete;

  }, 9999 /*ms*/ );
});

/*
* Wait for 'docPath' to get set.
*/
function docListener(docPath) {    // (string) => Promise of {...Firestore document }
  return new Promise( (resolve) => {

    const unsub = doc(docPath).onSnapshot( ss => {
      if (!ss.exists) return;
      const o = ss.data();
      resolve(o);
      /*await*/ unsub();
    });
  });
}

function preHeat(docPath) {    // (string) => ()
  const unsub = doc(`${docPath}/...`).onSnapshot( ss => {} );
  unsub();
}
