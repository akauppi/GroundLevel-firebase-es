/*
* src/ops-implement/crash.js
*
* Enable crash reporting
*/
import { init } from '/@adapters/raygun/index'

const RAYGUN_API_KEY = import.meta.env.RAYGUN_API_KEY;

init(RAYGUN_API_KEY);

// tbd. enable Raygun crash reporting from teh adapter (give API KEY as a parameter)

export {}
