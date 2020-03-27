/*
* jest-matchers.js
*
* Conveniency functions for testing, whether some Firebase action would pass security rules, or fail.
*
* Usage:
*   <<
*       await expect( ...set,get,update,delete... ).toAllow();    // or '.toDeny()'
*   <<
*/
const { assertFails, assertSucceeds } = require('@firebase/testing');

expect.extend({
  async toAllow(x) {    // x: expect thing
    try {
      await assertSucceeds(x);
      return { pass: true };
    } catch (err) {
      return { pass: false, message: () => 'Expected Firebase operation to be ALLOWED, but it was DENIED. ' + `[${err}]` }
    }
  },

  async toDeny(x) {
    try {
      await assertFails(x);
      return { pass: true };
    } catch (err) {
      return { pass: false, message: () => 'Expected Firebase operation to be DENIED, but it was ALLOWED! '+ `[${err}]` }
    }
  }
});

export {}

