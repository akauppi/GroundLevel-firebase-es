/*
* rules-test/setup.jest.js
*
* Global setup, imported once per run.
*/
import { docs } from './data';
import { primeSession } from './tools/guarded-session';
//import fs from 'fs';

//import * as firebase from '@firebase/testing';

// Note: Cannot share a JavaScript value between Jest test files [1]. However, we can set the OS level environment
//    variable for the Jest process. This way, we can create an id and pass it to the suites. Sweet! 🥞🍺🍦🍫🍮
//
//    [1] -> https://stackoverflow.com/questions/54654040/how-to-share-an-object-between-multiple-test-suites-in-jest

async function setup(_) {
  // tbd. DEBUG: using a stable session id (where does the data get initialized???)

  // note: MUST BE in lower case. Otherwise priming data never gets through.
  //    mentioned here -> https://github.com/firebase/firebase-tools/issues/1147 so likely we do something wrong in
  //    not seeing such an error message?
  //
  const sessionId = "abc";   // `rules-test-${Date.now()}`;   // e.g. 'rules-test-1586358763978'

  await primeSession(sessionId, docs);    // write the data contents only once

  /*** KEEP for a while
  // No longer needed, IF we use 8.6.0 and IF the rules file is not a symbolic link.
  //
  await firebase.loadFirestoreRules({
    projectId: sessionId,
    rules: fs.readFileSync("dut.rules", "utf8")   // name must match that in 'firebase.json'
  });
  ***/

  // Use this for seeing coverage reports: http://localhost:6767/emulator/v1/projects/<project_id>:ruleCoverage.html
  //  ^-- Note, that functionality seems to be broken. See DEVS/Wishes for Firebase.md
  //
  console.log("\nSession id:", sessionId);
}

export default setup;
