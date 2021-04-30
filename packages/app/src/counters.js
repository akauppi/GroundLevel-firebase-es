/*
* src/counters.js
*
* Counters collected at 'ops', for central analysis.
*/
import { counterInc } from '@ops/perf'

function counter(name) {    // (string) => { inc: (number=1) => () }

  return {
    inc: (diff=1) => {
      counterInc(name,diff);
    }
  }
}


// Counters used
//
const loginCounter = counter('users.pageView');
const guestCounter = counter('guests.pageView');

export {
  loginCounter,
  guestCounter
}
