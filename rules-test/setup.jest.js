/*
* rules-test/setup.jest.js
*
* Global setup, imported once per run.
*/
import { docs } from './data';
import { primeSession } from './tools/guarded-session';

// Note: Cannot share a JavaScript value between Jest test files [1]. However, we can set the OS level environment
//    variable for the Jest process. This way, we can create an id and pass it to the suites. Sweet! 🥞🍺🍦🍫🍮
//
//    [1] -> https://stackoverflow.com/questions/54654040/how-to-share-an-object-between-multiple-test-suites-in-jest

// **Session id**
//
// What we call "session id" is really the Firebase project id, provided to '@firebase/testing' library. Here are some
// points about using it - hopefully helps you find the policy you want.
//
// 1. Emulator UI only shows the active project (as in '.firebaserc').
//    Leads to: if you wish to see the data, use only that name.
// 2. If you use a static session id, the data will only get cleared when you close (and restart) the emulator.
// 3. [2] is normally acceptable for testing Security Rules, since we guard our data to be immutable. However, if
//    you use a static session id and change the data ('data.js'), restart the emulator. Otherwise remains of old data
//    remain and may confuse you.
//
// Note: MUST BE in lower case. Otherwise priming data never gets through.
//    mentioned here -> https://github.com/firebase/firebase-tools/issues/1147 Likely we do something wrong in not
//    seeing such an error message?
//
const sessionId = "abc";   // `rules-test-${Date.now()}`;   // e.g. 'rules-test-1586358763978'

async function setup(_) {
  await primeSession(sessionId, docs);    // write the data contents only once

  // Use this for seeing coverage reports: http://localhost:6767/emulator/v1/projects/<project_id>:ruleCoverage.html
  //  ^-- Note, that functionality seems to be broken. See '../DEVS/Wishes for Firebase.md'
  //
  console.log("\nSession id:", sessionId);
}

export default setup;
