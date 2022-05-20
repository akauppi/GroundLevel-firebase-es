/*
* src/ops-implement/crash.js
*
* Enable crash reporting in the adapters.
*/
import { init } from '/@adapters/raygun/index'

const RAYGUN_API_KEY = import.meta.env.RAYGUN_API_KEY;
init(RAYGUN_API_KEY, { enableCrashReporting: true });

