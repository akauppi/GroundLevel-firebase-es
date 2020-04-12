/*
* rules-test/setup.jest.js
*
* Global setup, imported once per run.
*/
import { data } from './data';
import { primeFromGlobalSetup } from './tools/guarded-session';
import fs from 'fs';

const firebase = require('@firebase/testing');

// Note: Cannot share a JavaScript value between Jest test files [1]. However, we can set the OS level environment
//    variable for the Jest process. This way, we can create an id and pass it to the suites. Sweet! 🥞🍺🍦🍫🍮
//
//    [1] -> https://stackoverflow.com/questions/54654040/how-to-share-an-object-between-multiple-test-suites-in-jest

async function setup(_) {
  const sessionId = `test-${Date.now()}`;   // e.g. 'test-1586358763978'
  await primeFromGlobalSetup(sessionId, data);    // write the data contents only once

  // Without this, the emulator would read the rules at startup, but not change its behaviour if they change. Having
  // a watch mode would render this unneeded.
  //
  firebase.loadFirestoreRules({
    projectId: sessionId,
    rules: fs.readFileSync("dut.rules", "utf8")   // name must match that in 'firebase.json'
  });

  // Use this for seeing coverage reports: http://localhost:6767/emulator/v1/projects/<project_id>:ruleCoverage.html
  //  ^-- Note, that functionality seems to be broken. See DEVS/Wishes for Firebase.md
  //
  console.log("\nSession id:", sessionId);
}

export default setup;
