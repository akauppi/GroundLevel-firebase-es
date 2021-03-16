/*
* vitebox/init/perf.js
*
* Interfaces and development implementations for:
*
*   - timing code blocks, statistically (across users)
*   - counters
*
* Collects the data in the browser. Certain URL can be used to dump it to the development console / clear the collections.
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
