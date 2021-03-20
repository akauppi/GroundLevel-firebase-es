/*
* src/meas.js
*
* Performance monitoring entries
*
* All entries are used through here.
*/
import { track, counter } from '/@firebase/perf'

const appInitTrack = track('appInit');

const someCounter = counter('some');

export {
  appInitTrack,
  someCounter
}
