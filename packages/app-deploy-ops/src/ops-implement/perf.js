/*
* src/ops-implement/perf.js
*
* Performance monitoring. Imported by application code.
*
* Edit this file to decide, which adapters are active.
*/

// Firebase Performance Monitoring
//import {reportTrack, counterInc} from '/@adapters/firebasePerf/init.js'

function reportTrack_NADA() {   // (string, Array of integer /*ms of epoch*/) => ()
}

function counterInc_NADA() {    // (string, num) => ()
}

const reportTrack = [];
const counterInc = [];

export {
  reportTrack,
  counterInc
}
