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
      if (/*(err instanceof FirebaseError) &&*/ err instanceof Object && err.code == 'permission-denied') {
        return { pass: false, message: () => format('allowed','denied', err) }
      } else {
        return weird(err)
      }
    }
  },

  async toDeny(prom) {
    try {
      await assertFails(prom);
      return { pass: true };
    } catch (err) {
      // "Expected request to fail, but it succeeded." (but no 'err.code', 😕)

      if (err.message == "Expected request to fail, but it succeeded.") {   // Firebase tools v.8
        return { pass: false, message: () => format('denied','allowed',err) }
      } else {
        return weird(err)
      }
    }
  }
});

function format(a,b,err) {
  return `Expected ${a} but the Firebase operation was ${b.toUpperCase()}. [${ err.message.replace('\n','') }]`;
}

function weird(err) {   // assert failed within the code; not allow/deny
  return { pass: false, message: () => 'INNER FAIL: '+ `[${err}]` }
}

export {}

