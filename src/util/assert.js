/*
* src/util/assert.js
*
* Assertion. We could also get one from 'npm' but this is INTENDED to be TEMPORARY, for development.
*/
function assert(cond) {
  if (!cond) {
    debugger;   // allows us to see the 'call stack' in browser
    throw "Assertion failed!";
  }
}

export { assert };

