/*
* vitebox/fake/@firebase-performance.js
*
* Fake the necessary parts of Firebase '@firebase/performance' module, so we can act like we're using it also in
* LOCAL mode (not needing a Firebase project).
*
* Naturally tried to get it working before resorting to this. (SDK 0.900.19; CLI 9.5.0). And conditional import
* unnecessarily complicates the code.
*/

function initializePerformance() {  // (app, { ...options }) => perf-handle
  return true;
}

function trace() {    // (perf-handle, name)

  return {
    record: () => {   // (number, number, { metrics?, attributes? }?) => ()
    }
  }
}

export {
  initializePerformance,
  trace
}

