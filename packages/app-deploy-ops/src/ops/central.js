/*
* src/ops/central.js
*
* Central logging.
* - application provides the calls
* - 'options.js' provides the adapter setup
*/
//import { assert } from '../assert.js'

import { logging } from './options'

const adapters = Array.isArray(logging) ? logging : [logging];  // allow single value instead of an array

function logGen(level) {    // ("debug"|"info"|"warn"|"error"|"fatal") => ((msg, opt) => ())

  function f(msg, opt) {
    adapters.forEach( (a) => {
      a.log(level, msg, opt);
    });
  }
  return f;
}

const central = {
  debug: logGen('debug'),
  info: logGen('info'),
  warn: logGen('warn'),
  error: logGen('error'),
  fatal: logGen('fatal')
}

export {
  central
}
