/*
* test-fns/userInfo.test.js
*
* Test that '/projectsC/.../userInfoC' gets updated, by cloud functions, when the global '/userInfoC' changes (if
* users are in the project).
*/
import { test, expect, describe, beforeAll } from '@jest/globals'

import { collection, listener_EXP } from 'firebase-jest-testing/firestoreAdmin'

import './matchers/toContainObject'

describe("userInfo shadowing", () => {
  let l;
  beforeAll( () => {
    l = listener_EXP("projects/1/userInfo");
  })

  test('Central user information is distributed to a project where the user is a member', async () => {
    const william = {
      displayName: "William D.",
      photoURL: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Dalton_Bill-edit.png"
    };

    // Write in 'userInfo' -> causes Cloud Function to update 'projectC/{project-id}/userInfo/{uid}'
    //
    await collection("userInfo").doc("abc").set(william);

    await expect( l("abc") ).resolves.toContainObject(william);
  });    // 300 ms

  test ('Central user information is not distributed to a project where the user is not a member', async () => {

    // Write in 'userInfo' -> should NOT turn up in project 1.
    //
    await collection("userInfo").doc("xyz").set({ displayName: "blah", photoURL: "https://no-such.png" });

    // firebase-jest-testing 0.0.3-beta.3
    await expect( l("xyz", o => !!o, 800 /*ms*/) ).resolves.toBeUndefined();

    // EXPLORING
    // tbd.

    // ideally:
    //await expect(prom).not.toComplete;    // ..but with cancelling such a promise

  }, 9999 /*ms*/ );
});

/*
* Observe a given document, with an optional timeout
*
* Resolves with:
*   - when the document changes the next time, with its contents as the value
*   - 'undefined' if the change removes the document (RESERVED; NOT TESTED)
*   - 'timeoutValue' if timed out and a specific value given (default: 'undefined')
*
* Note: This only checks for the next change. If you want, a predicate parameter can be added, to make it work as
*     eventuality check (i.e. resolves only if the predicate becomes true, at some point before timeout).
*/
async function waitForNextChange(docRef, trigger, timeout, timeoutValue) {   // (documentRef, _ => Promise of any, ms?, any?) => Promise of { ..document from 'docPath'.. }
  const ret = new Promise( (resolve) => {
    let skip= true;

    const unsub = docRef.onSnapshot(dss => {
      if (skip) {    // initial value; not interested
        skip = false;
        return;
      }

      const data = dss.data();  // first actual change
      unsub();
      resolve(data);
    });

    // We can implement a timeout within the Promise easier than from the outside (Jest doesn't seem to be able to
    // kill dangling promises properly).
    //
    if (timeout) {
      setTimeout(_ => {
        unsub();
        resolve(timeoutValue);
      }, timeout);
    }
  });

  /*await*/ trigger();
  return ret;
}

//REMOVE? const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
