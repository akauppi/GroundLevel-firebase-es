/*
* src/ops-implement/crash.js
*
* Enable crash reporting
*/
const RAYGUN_API_KEY = import.meta.env.RAYGUN_API_KEY;

debugger;

// tbd. Take Raygun eventually out to an adapter (give API KEY as a parameter)

import rg4js from 'raygun4js'

rg4js('enableCrashReporting', true);

rg4js('apiKey', RAYGUN_API_KEY);

export {}
