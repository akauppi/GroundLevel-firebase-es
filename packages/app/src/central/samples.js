/*
* src/central/obs.js
*
* Observed durations (e.g. how long a network call takes) or sizes (e.g. file size). With enough collected, these can
* be shown as statistical distributions in the monitoring.
*/
import {createObs} from './common'

//const randomObs = createObs("random");

const LOCAL = import.meta.env.MODE === "dev_local";
if (LOCAL) {    // support for testability (tbd. is there a better way to reveal something to Cypress scripts?)
  window.TEST_obsDummy = createObs("test-dummy");
}

export {
  //randomObs
}
