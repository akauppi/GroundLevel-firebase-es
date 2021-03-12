/*
* vitebox/init/track.js
*
* Development stage implementations for:
*
*   - timing collection
*   - counters
*
* Collects the data in the browser. Certain URL can be used to dump it to the development console (or.. maybe.. show
* in the browser?).
*/

function counter(name) {    // (string) => Counter
  return new Counter(name);
}

function timer(name) {    // (string) => Timer
  return new Timer(name);
}

export {
  counter,
  timer
}
