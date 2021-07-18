/*
* test-fns/matchers/timesOut.js
*
* Usage:
*   <<
*     expect(prom).timesOut(500);
*   <<
*/
import { expect } from '@jest/globals'

expect.extend({
  async timesOut(prom, ms) {   // (Promise of any, number) => { message: () => string, pass: boolean }

    // Wait for either 'prom' to complete, or a timeout.
    //
    const [resolved,error] = await Promise.race([ prom, timeoutMs(ms) ])
      .then(x => [x])
      .catch(err => [undefined,err] );

    const pass = (resolved === TIMED_OUT);

    return pass ? {
      message: () => `expected not to time out in ${ms}ms`,
      pass: true
    } : {
      message: () => `expected to time out in ${ms}ms, but ${ error ? `rejected with ${error}`:`resolved with ${resolved}` }`,
      pass: false
    }
  }
})

const timeoutMs = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); })
  .then( _ => TIMED_OUT);

const TIMED_OUT = Symbol()
