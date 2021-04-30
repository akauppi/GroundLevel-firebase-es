/*
* src/ops/perf.js
*
* Performance monitoring. Imported by application code.
*
* Load asynchronously (without waiting application launch), but take in performance reports right away.
*
* Edit this file to decide, which adapters are active.
*/
import { firebaseProm } from "../firebaseConfig";

let initialReports = [];
let initialCounts= [];

let reportTrack = (...args) => {  // (string, Array of integer /*ms of epoch*/) => ()
  initialReports.push(args);
}
let counterInc = (...args) => {    // (string, num) => ()
  initialCounts.push(args);
}

// Note: Cannot directly tie to 'firebaseProm' at the root (module loading level); "Cannot access .. before initialization".
//
verySoon(_ => {
  firebaseProm.then(async _ => {
    // Firebase Performance Monitoring
    const {reportTrack: /*as*/ a, counterInc: /*as*/ b} = await import('/@adapters/firebasePerf/init.js').then( mod => mod.init() );
    reportTrack = a;
    counterInc = b;

    initialReports.forEach(args => reportTrack(...args));
    initialCounts.forEach(args => counterInc(...args));
    initialReports = initialCounts = null;

    console.debug("Performance monitoring initialized.");
  });
});

function verySoon(f) {
  setTimeout(f,0);
}

export {
  reportTrack,
  counterInc
}
