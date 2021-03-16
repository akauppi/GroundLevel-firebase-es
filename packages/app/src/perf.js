/*
* src/perf.js
*
* Performance counters, stop watches etc. for the application.
*/
import { perf, counter } from '@ops/perf';   // dev gets one implementation; ops build another

const perf1 = perf('perf1');

const counter1 = counter('counter1');

export {
  perf1,
  counter1
}
