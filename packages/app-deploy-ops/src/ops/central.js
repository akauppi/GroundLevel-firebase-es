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

const central = {
  isReady: new Promise((resolve) => {
    resolveBreak = resolve;   // allows setting the promise from outside
  })
};    // { debug: (msg, ...) => (), info, warn, error, fatal }

/*** NOTE: Not sure why the below causes:
 * <<
 *    Cannot access 'logging' before initialization
 * <<
 *
// Wait for 'initializedProm' before using 'central'. Application code doesn't need it since 'main.js' has made sure
// logging is available.
//
const initializedProm = Promise.all(logging).then( arr => {
  function logGen(level) {    // ("debug"|"info"|"warn"|"error"|"fatal") => ((msg, opt) => ())
    const fns= arr.map( gen => gen(level) );

    function f(msg, opt) {
      fns.forEach( fn => {
        fn(msg, opt);
      });
    }
    return f;
  }

  central.debug = logGen('debug');
  central.info = logGen('info');
  central.warn = logGen('warn');
  central.error = logGen('error');
  central.fatal = logGen('fatal');
});
***/

async function init() {
  const arr = await Promise.all(logging);

  function logGen(level) {    // ("debug"|"info"|"warn"|"error"|"fatal") => ((msg, opt) => ())
    const fns= arr.map( gen => gen(level) );

    function f(msg, opt) {
      fns.forEach( fn => {
        fn(msg, opt);
      });
    }
    return f;
  }

  central.debug = logGen('debug');
  central.info = logGen('info');
  central.warn = logGen('warn');
  central.error = logGen('error');
  central.fatal = logGen('fatal');

  resolveBreak();
}

export {
  init,   // called by one place only ('main')
  central
}
