/*
* init/assert.js
*
* Simple assert implementation.
*
* There is no clear, light, browser-targeted 'assert' module in npm (is there?).
*
* tbd. Can we make the stack trace point to the caller of 'assert'? #contribute
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
