/*
* src/ops-implement/perf.js
*
* Performance monitoring. Imported by application code.
*
* Edit this file to decide, which adapters are active.
*/
import { init, reportTrack_v0, counterInc_v0 } from '/@adapters/raygun/index'

const RAYGUN_API_KEY = import.meta.env.RAYGUN_API_KEY;

init({ apiKey: RAYGUN_API_KEY });

const reportTrack = reportTrack_v0;
const counterInc = counterInc_v0;

export {
  reportTrack,
  counterInc
}
