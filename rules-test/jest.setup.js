/*
* rules-test/jest.setup.js
*
* Global setup / cleanup hooks for Jest.
*/
import { prepare, tearDown } from './setup.js';

// Note: Cannot share a JavaScript value between Jest test files [1]. However, we can set the OS level environment
//    variable for the Jest process. This way, we can create an id and pass it to the suites. Sweet! 🥞🍺🍦🍫🍮
//
//    [1] -> https://stackoverflow.com/questions/54654040/how-to-share-an-object-between-multiple-test-suites-in-jest

beforeAll( async () => {
  console.log( "BEFORE ALL:", process.env.MY_SESSION_ID );
  console.debug( "process.env.KIND before:", process.env.KIND );
  process.env.KIND = "ahoy!";
  await prepare();
  console.log( "PREPARED:", process.env.MY_SESSION_ID );
} );

afterAll( async () => {
  console.log( "AFTER ALL:", process.env.MY_SESSION_ID );
  await tearDown();
} );

// 5s has been seen to be too short; having too long delays certain faulty tests.
jest.setTimeout(18000);

