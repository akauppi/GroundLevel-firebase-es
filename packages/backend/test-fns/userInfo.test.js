/*
* test-fns/userInfo.test.js
*
* Test that '/projectsC/.../userInfoC' gets updated, by cloud functions, when the global '/userInfoC' changes (if
* users are in the project).
*/
import { test, expect, describe, beforeAll, afterAll } from '@jest/globals'

import { collection, doc, preheat_EXP } from 'firebase-jest-testing/firestoreAdmin'

import './matchers/timesOut'
import './matchers/toContainObject'

describe("userInfo shadowing", () => {

  // Warm up the client. Cuts ~300ms from the reported test results (653 -> 367 ms)
  //
  beforeAll( () => {
    preheat_EXP("projects/1/userInfo");
  })

  /* tbd. This could solve #83 without needing '--forceExit'. (Integrate with 'firebase-jest-testing', some day..)
  afterAll(async () => {
    const firebase = collection("dummy").firebase;
    await firebase.firestore().disableNetwork();
  }); */

  test('Central user information is distributed to a project where the user is a member', async () => {
    const william = {
      displayName: "William D.",
      photoURL: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Dalton_Bill-edit.png"
    };

    const t0 = performance.now();

    function sinceT0() {
      const td = performance.now() - t0;
      return Math.round(td);
    }

    const docProm = docListener("projects/1/userInfo/abc");   // Promise of { ..Firestore document }

    // Write in 'userInfo' -> causes Cloud Function to update 'projectC/{project-id}/userInfo/{uid}'
    //
    /*await*/ collection("userInfo").doc("abc").set(william).then( _ => {
      console.log(`Write succeeded (${ sinceT0() }ms)`)   // 819ms (cold start); 563ms (warm)
    });

    docProm.then( _ => {
      console.log(`Target update detected; took ${ sinceT0() }ms`);    // 8791ms (cold start); 713ms (warm)
    })

    await expect( docProm ).resolves .toContainObject(william);
  })

  test('Central user information is not distributed to a project where the user is not a member', async () => {

    const docProm = docListener("projects/1/userInfo/xyz" );

    // Write in 'userInfo' -> should NOT turn up in project 1.
    //
    await collection("userInfo").doc("xyz").set({ displayName: "blah", photoURL: "https://no-such.png" });

    await expect( docProm ).timesOut(400);

    // ideally: await expect(prom).not.toComplete;

  }, 9999 /*ms*/ )
})

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
