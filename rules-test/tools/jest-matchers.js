/*
* tools/jest-matchers.js
*
* Conveniency functions for testing, whether some Firebase action passed security rules, or not.
*
* Note: '@firebase/testing' provides 'assertFails' and 'assertSucceeds' but we chose intentionally not to use them.
*      They are only thin wrappers around the promise, and we gain more control and simplicity of code by dealing
*      with the promises directly.
*
*      Source code of 'assertFails' and 'assertSucceeds' -> https://github.com/firebase/firebase-js-sdk/blob/6b53e0058483c9002d2fe56119f86fc9fb96b56c/packages/testing/src/api/index.ts#L258-L268
*/
expect.extend({
  async toAllow(prom) {
    try {
      await prom;
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
      await prom;
      return { pass: false, message: () => format('denied','allowed',err) }
    } catch (err) {
      if (/*(err instanceof FirebaseError) &&*/ err instanceof Object && err.code == 'permission-denied') {
        return { pass: true }
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
