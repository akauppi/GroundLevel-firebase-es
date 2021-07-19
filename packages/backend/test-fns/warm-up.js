/*
* test-fns/warm-up.js
*
* A script to be run right after the emulators are started.
*
* Without this, the Cloud Functions are not ready, once Jest tests are run, and the initial runs are not descriptive
* of actual performance.
*
* Difference:
*   - with this:    xxx
*   - without this: xxx
*
* The author asked Firebase about this, and (even with emulation) having the functions lazy is the intended behavior
* (this is fine if the wakeup time is in 100's of ms; it's creating problems if it is 1000's.
*
* Context:
*   Normal Node.js (Jest not involved).
*/
import { doc } from 'firebase-jest-testing/firestoreAdmin'
import { httpsCallable } from 'firebase-jest-testing/firebaseClientLike'

const warmUps = [
  /*
  * Warm up userInfo.test.js
  *
  * Write something that triggers the backend function but doesn't matter to the tests (or remove it).
  */
  async function() {
    await doc("userInfo/priming").set({});
  },

  /*
  * Warm up logging
  *
  * Call the callable with something that's ignored - an array of no log entries :).
  */
  async function() {
    const fnLog = httpsCallable("cloudLoggingProxy_v0");
    await fnLog({ les: [] });
  }
];

await Promise.all(warmUps);   // top level await

console.log("Warmed up!")
