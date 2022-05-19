/*
* vitebox/ops/perf.js
*
* Performance monitoring - development version
*/

function assert(cond,msg) {
  if (!cond) throw new Error(msg || "(assert failed)");
}

function reportTrack(name, stamps) {    // (string, Array of integer /*ms of epoch*/) => ()
  assert(stamps.length >= 2);

  const start = stamps[0];
  const duration = stamps[stamps.length-1] - start;
  const laps = stamps.length > 2 ? stamps.slice(1,-1).map( x => x-start ) : undefined;

  console.debug(`[PERF ${name}]:`, {
    start: start.toFixed(1),
    duration: duration.toFixed(1),
    laps: laps.map( n => n.toFixed(1) )
  });
}

const counters = new Map();

function counterInc(name, diff) {   // (string, number) => ()
  const was = counters.get(name) || 0;
  const v = was + diff;

  counters.set(name,v);

  console.debug(`[COUNTER ${name}]:`, v);
}

export {
  reportTrack,
  counterInc
}
