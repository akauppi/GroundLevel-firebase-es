/*
* src/assert.js
*
* Simple assert implementation.
*
* This is for the application. You may or may not want to use an assert at production time: up to you.
*/
function assert(cond, msgOpt) {
  if (!cond) {
    if (msgOpt) {   // tbd. do we want this - maybe not?
      console.assert(msgOpt);
    }
    // tbd. Is there a way to set the callstack to our caller's? #help
    throw new AssertError(`Assertion failed: ${msgOpt || '(no message)'}`);
  }
}

/*
* Throw an Error that manipulates stack to point to the line that has the 'assert'.
*/
class AssertError extends Error {
  constructor(msg) {
    super(msg);
    this.name = this.constructor.name;

    // We likely get a stack via 'super' constructor. Tune it.
    console.debug("!!! Assert stack:", this.stack);

    // tbd. Unfinished
  }
}

export { assert }
