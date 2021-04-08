/*
* src/ops/central.js
*
* Central logging.
*
* We are imported by _application_ code; unless 'catch.js' imports us dynamically, which may happen prior to
* the application being initialized.
*
* - 'options.js' provides the adapter setup
*/
//import { assert } from '../assert.js'

import { logging } from './options'

const adapters = Array.isArray(logging) ? logging : [logging];  // allow single value instead of an array

function logGen(level) {    // ("debug"|"info"|"warn"|"error"|"fatal") => ((msg, opt) => ())

  const fns= adapters.map( a => a(level) );

  function f(msg, opt) {
    fns.forEach( fn => {
      fn(msg, opt);
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
