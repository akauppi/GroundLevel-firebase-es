/*
* functions-warm-up/index.js
*
* Warm up the Cloud Functions.
*
* Context:
*   Launched ** from the Cloud Functions themselves ** when they are loaded to Functions Emulator.
*
* Note:
*   This module is run _before_ the emulator claims it is ready by opening port 4000. 😊🌞
*
*   This is all very EXPERIMENTAL. Ideally, Firebase Emulators would offer an option to wake up all Cloud Functions,
*   before the emulators are announced ready by opening the 4000 port!
*/
import { strict as assert } from 'assert'
import { performance } from 'perf_hooks'

import { httpsCallable } from './httpsCallable.js'
import { ackTrigger } from '../hack/ack-trigger.js'

import admin from 'firebase-admin'    // version in 'functions/package.json'

admin.initializeApp();
const dbAdmin = admin.firestore();

/*
* Make the 'userInfo' -observing Cloud Function jump up the bed.
*
* 1. Write a priming project
* 2. Write info about a person to 'userInfo'
*   These two steps need to be separate, since the Cloud Function observes writes against already existing projects.
* 3. Observe that the userInfo is reflected in the project.
*
* Notes:
*   - When this is run, the database is empty. The emulators just started.
*   - The only reason we need the priming project is to time, how long it takes before the change has happened
*     (just writing a dummy would wake up the Cloud Function).
*   - Whatever we write, the tests will wipe it away (we won't be able to affect the tests).
*/
async function warmUpUserInfo() {

  await dbAdmin.doc("projects/1").set({ members: ['def'], authors: ['def'] });

  // Write to a document that 'userInfo' Cloud Function listens to; and reacts, so that we get a timing and confirmation
  // it really is up.
  //
  const t0 = performance.now();
  await dbAdmin.doc("userInfo/def").set({ });   // contents do not matter

  // Listen to the change - just to get a timing of the wake-up.
  //
  const x = await docListener("projects/1/userInfo/def");

  console.info(`Woke up Cloud Function watching Firestore - took ${ Math.round(performance.now() - t0) }ms`);
    // 3919, 4717ms

  await ackTrigger("1");
}

function docListener(docPath) {    // (string) => Promise of {...Firestore document }
  return new Promise( (resolve) => {

    const unsub = dbAdmin.doc(docPath).onSnapshot( ss => {
      if (!ss.exists) return;
      const o = ss.data();
      resolve(o);
      /*await*/ unsub();
    });
  });
}

/*
* Brings first Jest test times down from ~3000ms -> 60ms
*/
async function warmUpLogging() {
  const fnLog = httpsCallable("cloudLoggingProxy_v0");

  const t0 = performance.now();
  const ret = await fnLog({ les: [] });   // log no entries = no-op   -> '{ data: true }'
  assert(ret.data === true);

  console.info(`Woke up Cloud Function 'cloudLoggingProxy_v0' - took ${ Math.round(performance.now() - t0) }ms`);
    // 2008, 3297, 3635, 3965, 5939 ms

  await ackTrigger("2");
}

// Initialize. Allows the caller to print the error, if something goes haywire.
//
async function init() {
  return Promise.all([
    warmUpUserInfo(),
    warmUpLogging()
  ]);
}

export { init }
