/*
* src/ops-implement/perf.js
*
* Performance monitoring. Imported by application code.
*
* Edit this file to decide, which adapters are active.
*/
const RAYGUN_API_KEY = import.meta.env.RAYGUN_API_KEY;

// tbd. Take Raygun eventually out to an adapter (give API KEY as a parameter)

//import rg4js from 'raygun4js'
//const rg4jsProm = import('raygun4js').then( mod => mod.rg4js )
const rg4js = require('raygun4js');

debugger;

rg4jsProm.then( rg4js => {

  rg4js('apiKey', RAYGUN_API_KEY);
})

function reportTrack() {   // (string, Array of integer /*ms of epoch*/) => ()
}

function counterInc() {    // (string, num) => ()
}

export {
  reportTrack,
  counterInc
}
