/*
* test-fns/logging.test.js
*
* Note: Callables need to be tested with the client JS library (not 'firebase-admin'), but we still run this under Node.
*/
import { test, expect, describe, beforeAll, afterAll } from '@jest/globals'

function fail(msg) { throw new Error(msg); }    // Jest doesn't offer one

// Client side SDK
import { initializeApp, deleteApp, getApps } from '@firebase/app'
import { getFunctions, useFunctionsEmulator, httpsCallable } from '@firebase/functions'

import firebaseJson from '../firebase.json'
const FUNCTIONS_EMULATOR_PORT = firebaseJson.emulators.functions.port ||
  fail("Cannot read Functions emulator port from './firebase.json'");

let myApp;
let fns;

const projectId = process.env["GCLOUD_PROJECT"] || fail("No 'GCLOUD_PROJECT' env.var.");

beforeAll( () => {
  myApp = initializeApp({
    projectId,
    //auth: null    // unauth is enough
  }, "testing");

  fns = getFunctions(myApp);
  useFunctionsEmulator(fns, "localhost", FUNCTIONS_EMULATOR_PORT );
});

afterAll( async () => {
  await deleteApp(myApp);

  // DEBUG: Above is not enough to let Jest return to command line. Why?
  //
  //  See inspiration -> https://github.com/facebook/jest/issues/1456

  const apps = getApps();   // is empty
  console.log("!!!", apps);
} );

describe ('Can proxy application logs', () => {

  test ('good log entries', async () => {
    const msgs = [
      { level:'info', msg:'Jack says hi!' },
      { level:'warn', msg:'Avrell is hungry!' },
      { level:'error', msg:'William' },
      { level:'fatal', msg:'Joe is in jail!' }
    ];

    const fnLog = httpsCallable(fns,"logs_v1");

    const data = (await fnLog(msgs)).data;    // null
    expect(data).toBeNull();
  });
});
