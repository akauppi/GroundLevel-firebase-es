/*
* src/track.js
*
* Tracks measure performance over a section of code. In ops, the results are shipped to a central monitoring hub,
* for statistical aggregation and analysis.
*
* - duration
* - "lap times" = interim timings
*/
import { reportTrack } from '@ops/perf'

import { assert } from '/@tools/assert.js'

function fail(msg) { throw new Error(msg); }

const namesTaken = new Set();

/*
* Measure time it takes for a certain code execution trail to be covered.
*   {
*     start() {
*       lap()
*       //setAttribute()    // tbd. maybe not
*       end()
*     }
*   }
*
* 'lap' and 'setAttribute' are optional to be called; 'end' is expected always to be called.
*/
function track(name) {    // (string) => { start }

  assert(!namesTaken.has(name), 'Track already created');
  namesTaken.add(name);

  //let collectedAttrs;   // undefined | {...}
  const stamps = [];

  function start() {  // () => { lap, /*setAttribute,*/ end }
    stamps[0] = performance.now();   // "epoch in ms"

    function lap(lapId) {   // (string?) => ()
      const t = performance.now();
      stamps.push(t);
    }

    /*function setAttribute(k,v) {    // (string, any) => ()
      collectedAttrs = collectedAttrs || {};
      collectedAttrs[k] = v;
    }*/

    function end() {
      const t = performance.now();
      stamps.push(t);

      reportTrack(name,stamps);
    }

    return { lap, /*setAttribute,*/ end };
  }

  return {
    start
  };
}

// Tracks used
//
const appInitTrack = track('appInit');

export {
  appInitTrack
}
