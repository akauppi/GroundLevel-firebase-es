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
