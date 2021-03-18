/*
* src/ops/central.js
*
* Central logging.
*/
//import { assert } from '../assert.js'

/*** #rework
// Can have multiple logs handlers (good for comparing alternatives)
//  - { }   // ignore
//  - { type: ..., ..custom fields }
//
for( const o of opsLogs ) {
  if (!o.type) {
    // skip
  } else {
    throw new Error( `Unexpected 'logs[].type' in ops config: ${o.type}`);
  }
}
***/

let logGen;   // (string) => (string [, object]) => ()

if (true) {   // no central logging
  logGen = _ => (/*msg, opt*/) => {}
}

const central = {
  debug: logGen("debug"),
  info: logGen("info"),
  warn: logGen("warn"),
  error: logGen("error"),

  /** considering (maybe we just want to throw errors; catch those into 'central' in 'catch')
  fatal: (msg, opt) => {    // (msg,object|XxxError|undefined) => Error;    use as 'throw central.fatal(...,{ opt } | err)'
    if (opt instanceof Error) {
      lf(msg, { error: opt });    // #tune

      return new WrappedError(msg,opt);
    } else {
      lf(msg,opt);
      return new Error( `${msg} ${ JSON.stringify(opt) }` );
    }
  }
  **/
}

export {
  central
}
