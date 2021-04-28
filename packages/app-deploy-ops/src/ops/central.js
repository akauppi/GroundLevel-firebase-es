/*
* src/ops/central.js
*
* Central logging.
*
* Imported by _application_ code; unless 'catch.js' imports us dynamically, which may happen prior to the application
* being initialized.
*
* - 'options.js' provides the adapter setup
*/
//import { assert } from '../assert.js'

import { logging } from '../options'
  //
  // logging: Array of (Promise of?) (level) => (msg, ...) => ()

let resolveBreak;

const central = {};    // { info|warn|error: (msg, ...) => () }

// Fatal logging is only available for 'catch.js'; not to be used directly.
//
const fatalProm = new Promise((resolve) => {
  resolveBreak = resolve;   // allows setting the promise from outside
});

async function init() {
  const arr = await Promise.all(logging);

  function logGen(level) {    // ("debug"|"info"|"warn"|"error"|"fatal") => ((msg, opt) => ())
    const fns= arr.map( gen => gen(level) );

    function f(msg, ...args) {
      fns.forEach( fn => {
        fn(msg, ...args);
      });
    }
    return f;
  }

  central.info = logGen('info');
  central.warn = logGen('warn');
  central.error = logGen('error');

  const fatal = logGen('fatal');
  resolveBreak(fatal);
}

export {
  init,   // called by one place only ('main')
  central,
  fatalProm
}
