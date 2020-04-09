/*
* rules-test/setup.jest.js
*
* Global setup, imported once per run.
*/
import { data } from './data';
import { primeFromGlobalSetup } from './tools/guarded-session';

// Note: Cannot share a JavaScript value between Jest test files [1]. However, we can set the OS level environment
//    variable for the Jest process. This way, we can create an id and pass it to the suites. Sweet! 🥞🍺🍦🍫🍮
//
//    [1] -> https://stackoverflow.com/questions/54654040/how-to-share-an-object-between-multiple-test-suites-in-jest

async function setup(_) {
  console.log("You get to GLOBAL SETUP only once!");    // DEBUG

  const sessionId = `test-${Date.now()}`;   // e.g. 'test-1586358763978'
  await primeFromGlobalSetup(sessionId, data);    // write the data contents only once
}

export default setup;
