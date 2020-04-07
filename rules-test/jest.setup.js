/*
* rules-test/jest.setup.js
*
* Global setup / cleanup hooks for Jest.
*/

import { globalCleanup } from './setup.js';

afterAll(() => {
  //console.log("GREETINGS from jest.setup.js");
  globalCleanup();
});

// 5s has been seen to be too short; having too long delays certain faulty tests.
jest.setTimeout(8000);

