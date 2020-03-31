/*
* jest-matchers.js
*
* Conveniency functions for testing, whether some Firebase action passed security rules, or not.
*/
const { assertFails, assertSucceeds } = require('@firebase/testing');

expect.extend({
  async toAllow(prom) {    // prom: expect thing
    try {
      await assertSucceeds(prom);
      return { pass: true };
    } catch (err) {
      return { pass: false, message: () => 'Expected Firebase operation to be ALLOWED, but it was DENIED. ' + `[${err}]` }
    }
  },

  async toDeny(prom) {
    try {
      await assertFails(prom);
      return { pass: true };
    } catch (err) {
      return { pass: false, message: () => 'Expected Firebase operation to be DENIED, but it was ALLOWED! '+ `[${err}]` }
    }
  }
});

export {}

