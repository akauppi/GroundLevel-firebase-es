/*
* test-fns/userInfo.test.js
*
* Test that '/projectsC/.../userInfoC' gets updated, by cloud functions, when the global '/userInfoC' changes (if
* users are in the project).
*/
import { test, expect, describe, beforeAll } from '@jest/globals'

import { collection, eventually /*, preheat_EXP*/ } from 'firebase-jest-testing/firestoreAdmin'

import './matchers/toContainObject'

describe("userInfo shadowing", () => {

  /* tbd. enable once 0.0.3-beta.4 is published
  // Have this, to move ~320ms of test execution time away from the reports (shows recurring timing). To show first
  // (worst) timing, don't do this.
  //
  beforeAll( () => {
    preheat_EXP("projects/1/userInfo");
  })
  */

  test('Central user information is distributed to a project where the user is a member', async () => {
    const william = {
      displayName: "William D.",
      photoURL: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Dalton_Bill-edit.png"
    };

    // Write in 'userInfo' -> causes Cloud Function to update 'projectC/{project-id}/userInfo/{uid}'
    //
    await collection("userInfo").doc("abc").set(william);

    await expect( eventually("projects/1/userInfo/abc") ).resolves.toContainObject(william);
  });    // 300 ms

  test ('Central user information is not distributed to a project where the user is not a member', async () => {

    // Write in 'userInfo' -> should NOT turn up in project 1.
    //
    await collection("userInfo").doc("xyz").set({ displayName: "blah", photoURL: "https://no-such.png" });

    await expect( eventually("projects/1/userInfo/xyz", o => !!o, 800 /*ms*/) ).resolves.toBeUndefined();

    // ideally:
    //await expect(prom).not.toComplete;    // ..but with cancelling such a promise

  }, 9999 /*ms*/ );
});
