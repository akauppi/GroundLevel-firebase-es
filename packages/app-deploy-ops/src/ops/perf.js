/*
* src/ops/perf.js
*
* Performance monitoring.
*
* Imported by application code.
*
* Edit this file to decide, which adapters are active.
*/

// Firebase Performance Monitoring
import { reportTrack, counterInc } from '/@adapters/firebasePerf/adapter.js'
  //
  // reportTrack: (string, Array of integer /*ms of epoch*/) => ()
  // counterInc: (string, num) => ()

export {
  reportTrack,
  counterInc
}

