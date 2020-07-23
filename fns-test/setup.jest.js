/*
* fns-test/setup.jest.js
*
* Global setup, imported once per run.
*/
import { docs } from './data'
import { primeSession } from './tools/session'

// Note: Cannot share a JavaScript value between Jest test files [1]. However, we can set the OS level environment
//    variable for the Jest process. This way, we can create an id and pass it to the suites. Sweet! 🥞🍺🍦🍫🍮
//
//    [1] -> https://stackoverflow.com/questions/54654040/how-to-share-an-object-between-multiple-test-suites-in-jest

async function setup(_) {
  const sessionId = `fns-test-${Date.now()}`;   // e.g. 'fns-test-1586358763978'

  await primeSession(sessionId, docs);    // write the data
}

export default setup;
