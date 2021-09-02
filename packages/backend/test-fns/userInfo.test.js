/*
* test-fns/userInfo.test.js
*
* Test that '/projectsC/.../userInfoC' gets updated, by cloud functions, when the global '/userInfoC' changes (if
* users are in the project).
*/
import { test, expect, describe, beforeAll } from '@jest/globals'

import { collection, doc, preheat_EXP } from 'firebase-jest-testing/firestoreAdmin'

import './matchers/timesOut'
import './matchers/toContainObject'

// First call (when server is cold started) takes ~2500 ms (native macOS). To get away from that, DC runs a warm-up
// lap on this test, reducing times by ~2s.

describe("userInfo shadowing", () => {

  // Warm up the client. Cuts ~300ms from the reported test results (653 -> 367 ms); native macOS
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

    await expect( docListener("projects/1/userInfo/abc") ).resolves.toContainObject(william);
  });
    // DC (mac):
    //  - no warm-up:   3622, 3795 ms     # run from clean: 'docker compose down', 'docker compose up warm-up'
    //  - warmed up:     559,  729 ms
    //
    // CI (DC):
    //  - no warm-up:   2184 ms           # warm-up disabled by editing the DC yml
    //  - warmed up:     550,  678 ms

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
