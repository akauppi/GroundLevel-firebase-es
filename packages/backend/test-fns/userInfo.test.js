/*
* test-fns/userInfo.test.js
*
* Test that '/projectsC/.../userInfoC' gets updated, by cloud functions, when the global '/userInfoC' changes (if
* users are in the project).
*/
import { test, expect, describe, beforeAll } from '@jest/globals'

import { collection, doc, preheat_EXP } from 'firebase-jest-testing/firestoreAdmin'

import './matchers/toContainObject'

describe("userInfo shadowing", () => {

  // Have this, to move ~320ms of test execution time away from the reports (shows recurring timing). To show first
  // (worst) timing, don't do this.
  //
  beforeAll( () => {
    preheat_EXP("projects/1/userInfo");
  })

  test('Central user information is distributed to a project where the user is a member', async () => {
    const william = {
      displayName: "William D.",
      photoURL: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Dalton_Bill-edit.png"
    };

    // Write in 'userInfo' -> causes Cloud Function to update 'projectC/{project-id}/userInfo/{uid}'
    //
    await collection("userInfo").doc("abc").set(william);

    await expect( watchOne("projects/1/userInfo/abc") ).resolves.toContainObject(william);
  }, 6000 /*needed until Cloud Functions are woken up! (4000 wasn't enough)*/ );    // 300 ms

  test ('Central user information is not distributed to a project where the user is not a member', async () => {

    // Write in 'userInfo' -> should NOT turn up in project 1.
    //
    await collection("userInfo").doc("xyz").set({ displayName: "blah", photoURL: "https://no-such.png" });

    await sleepMs(300);   // give time
    //await expect( doc("projects/1/userInfo/xyz").get().then( ss => ss.exists ) ).resolves.toBe(false);

    await expect( doc("projects/1/userInfo/xyz").get() ).resolves.toContainObject( { exists: false } );

  }, 9999 /*ms*/ );

  // ideally:
  //await expect(prom).not.toComplete;    // ..but with cancelling such a promise

});

/*
* Wait for 'docPath' to get set.
*/
function watchOne(docPath) {    // (string) => Promise of {...Firestore document }
  return new Promise( (resolve) => {

    const unsub = doc(docPath).onSnapshot( ss => {
      if (!ss.exists) return;
      const o = ss.data();
      resolve(o);
      unsub();
    });
  });
}

const sleepMs = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });
