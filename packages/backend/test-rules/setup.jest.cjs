/*
* back-end/test-rules/setup.jest.cjs
*
* Note! Jest 27.0.0-next.3 does NOT allow this to be an ES module!
*     See -> https://github.com/facebook/jest/issues/9430#issuecomment-653818834
*
* Sets the (immutable) data for the Rules tests.
*/
//import { docs } from './docs.js'
const docs = require('./docs.cjs');

//import { clearAndPrime } from './tools/clearAndPrime.js'
const clearAndPrime = require('./tools/clearAndPrime.cjs');

const setup = async _ => {
  // Clean the existing data and prime with ours

  await clearAndPrime(docs);

  console.debug("Docs primed for test-rules.");
}

//export default setup;
module.exports = setup;
