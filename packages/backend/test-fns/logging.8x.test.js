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

  test ('accepts Cloud Logging log entries', async () => {
      const ts = new Date().toISOString();

    // Entries must follow the CloudLogging 'LogEntry' schema:
    //  -> https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry
    //
    // {
    //    "severity": "INFO"|"WARNING"|"ERROR"|"CRITICAL",
    //    "timestamp": ISO, eg. "2021-05-02T15:08:09.073Z",
    //    "jsonPayload": {
    //      "msg": string                     // actual message
    //      "args": undefined | Array of any  // additional parameters
    //    }
    // }
    //
    function le(severity, msg, ...args) {
      return {
        severity,
        timestamp: ts,
        jsonPayload: {
          msg,
          args: args.length > 0 ? args : undefined
        }
      }
    }

    const les = [
      le("INFO", 'Jack says hi!' ),
      le('WARNING', 'Avrell is hungry!' ),
      le('ERROR', 'William', 1, 2, { more: 3 } ),
      le('CRITICAL', 'Joe is in jail!' )
    ];

    const fnLog = fns.httpsCallable("cloudLoggingProxy_v0");

    const data = (await fnLog({ les, ignore: "test" })).data;    // null
    expect(data).toBeNull();
  });
});

