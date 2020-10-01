/*
* init/assert.js
*
* Simple assert implementation.
*
* The alternative would be to a) not use assert, b) use 'rollup-plugin-node-builtins' but brings in a lot more, as well.
*
* tbd. Compare this with node.js 'assert' source and maybe learn from there.
* tbd. Can we make the stack trace point to the caller of 'assert'? #contribute
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
