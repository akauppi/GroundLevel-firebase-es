/*
* src/central/commonPerf.js
*
* The API for performance instrumentation.
*
* Observations are passed to Realtime Database (for further server-to-server delivery), or can be hooked for delivery
* to other monitoring systems (initially, Firebase Performance is supported).
*/
import { createObs } from './common'

// Observation names are created dynamically, based on the received calls.
//
const map = new Map();    // Map of "{obs-name}" -> number => ()

function obsByName(s) {
  if (!map.has(s)) {
    map.set(s, createObs(s));
  }
  return map.get(s);
}

const hooks = [   // Array of ((string, number) => ()|Promise of ())

  function (s,v) {
    obsByName(s)(v);
  }
];

/*
* Deliver a performance measurement to the default destination (Realtime Database proxy), and any additional hooks added.
*/
// tbd. Currently not suitable for async hooks, but can be done that way (would cause '.lap' and '.end' to be free-
//    running tails, unless application code awaits on them).
//
function deliver(s,v) {
  hooks.forEach( f => {
    f(s,v);
  })
}

/*
* Interface:
*
*   - calling the function starts the timing
*   - calling 'lap(string)' (optional) times a lap; starts timing for the next
*   - calling 'end()' (optional, if laps are used) ends the timing
*
* Actual performance names for the blocks are:
*   - '{name}'          if no laps, just 'end()'
*   - '{name}_{1..n}'   for each lap
*/
function createPerfStart(name) {   // string => () => { lap: (string) => (), end: () => () }

  return () => {
    const t0 = performance.now();   // timing until '.end()'
    let tLast = t0;                 // start of first lap

    return {
      lap(lapName) {
        const t = performance.now();
        deliver(`${name}_${lapName}`, t-tLast);
        tLast = t;
      },

      // Pushes the overall duration, from start to end (independent of any possible laps).
      //
      end() {
        const dt = performance.now() - t0;
        deliver(name, dt);
      }
    }
  }
}

function perfHook(f) {    // (string, number) => () | Promise of ()
  hooks.push(f);
}

export {
  createPerfStart,
  perfHook
}
