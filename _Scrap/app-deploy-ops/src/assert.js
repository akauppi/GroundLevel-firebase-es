/*
* src/assert.js
*
* Simple assert implementation.
*
* Note: This is only for the 'init' code's needs. The application carries its own assert, or doesn't.
*/
function assert(cond, msgOpt) {
  if (!cond) {
    if (msgOpt) {
      console.assert(msgOpt);
    }
    throw new Error(`Assertion failed: ${msgOpt || '(no message)'}`);
  }
}

export { assert }
