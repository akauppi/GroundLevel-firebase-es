/*
* test-fns/logging.8x.test.js
*
* Note: Callables need to be tested with the client JS library (not 'firebase-admin'), but we still run this under Node.
*/
import { test, expect, describe, beforeAll, afterAll } from '@jest/globals'

function fail(msg) { throw new Error(msg); }    // Jest doesn't offer one

// Client side SDK (Firebase 8.x API)

import { firebase } from '@firebase/app'
import 'firebase/functions'

//import { initializeApp, deleteApp, getApps } from '@firebase/app'
//import { getFunctions, useFunctionsEmulator, httpsCallable } from '@firebase/functions'

import firebaseJson from '../firebase.json'
const FUNCTIONS_EMULATOR_PORT = firebaseJson.emulators.functions.port ||
  fail("Cannot read Functions emulator port from './firebase.json'");

let myApp;
let fns;

const projectId = process.env["GCLOUD_PROJECT"] || fail("No 'GCLOUD_PROJECT' env.var.");

beforeAll( () => {
  myApp = firebase.initializeApp({
    projectId,
    //auth: null    // unauth is enough
  }, "testing");

  fns = firebase.functions(myApp);
  fns.useEmulator("localhost", FUNCTIONS_EMULATOR_PORT );
});

afterAll( async () => {
  await myApp.delete();
} );

describe ('Can proxy application logs', () => {

  test ('good log entries', async () => {
    const msgs = [
      { level:'info', msg:'Jack says hi!' },
      { level:'warn', msg:'Avrell is hungry!' },
      { level:'error', msg:'William' },
      { level:'fatal', msg:'Joe is in jail!' }
    ];

    const fnLog = fns.httpsCallable("logs_v1");

    const data = (await fnLog(msgs)).data;    // null
    expect(data).toBeNull();
  });
});
