/*
* fns-test/monitoring.test.js
*
* Test the central monitoring functions (logs etc.)
*/
import { strict as assert } from 'assert'

import { test, expect, describe, beforeAll, afterAll } from '@jest/globals'

import { __ } from '../.__.js'; const { projectId } = __;

// ONLY for Firestore
//import * as firebase from '@firebase/testing'

import * as firebase from 'firebase/app';   // according to npm firebase instructions

import 'firebase/functions';

firebase.initializeApp({
  projectId    // must match what you have in '.firebaserc'
});

const [FUNCTIONS_URL, FIRESTORE_HOST] = ["http://localhost:5001", "localhost:8080"];

firebase.functions().useFunctionsEmulator(FUNCTIONS_URL);   // must be *after* '.initializeApp'

let fns;

/*
* Initialize Firebase
*/
beforeAll( () => {

  fns = firebase.app().functions(/*"europe-west3"*/);
  assert(fns);
});

/*** not needed???
afterAll( () => {
  firebase.app().delete();
})
***/

describe("monitoring functions", () => {
  let fnLogs, fnFatal;

  beforeAll( () => {
    fnLogs = fns.httpsCallable('logs_v190720');
    fnFatal = fns.httpsCallable('fatal_v210720');
  });

  //--- Logs ---

  test('should be able to log in multiple levels', async () => {

    await fnLogs({ level: "debug", msg: "0 debug", payload: { "_": 0} });
    await fnLogs({ level: "info", msg: "1 info", payload: {a: 1} });
    await fnLogs({ level: "warn", msg: "2 warn", payload: {b: 2} });
    await fnLogs({ level: "error", msg: "3 error", payload: {c: 3} });

    // Cannot test what emerged in the logs - do that manually.
  });

  //--- Fatal reporting ---

  test('should be able to report a fatal (unexpected code path) condition', async () => {

    await fnFatal({ msg: "Testing fatal", ex: new Error("abc") });

    // Again, check manually the outcome
  });
});
