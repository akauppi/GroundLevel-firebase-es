/*
* init/opsConfig.js
*
* Reader for './ops-config.js'. Provides schema checking.
*/
import { ops as opsRaw } from '../ops-config.js'
  // {
  //    perf: Array of { type: 'firebase'|'...', ... }
  //    logs: Array of { type: '...', ... }
  //    crash: Array of { type: '...', ... }
  // }

const oMap = (obj, fn) =>    // ({ k:v }, fn) => { k:fn(v) }   ; helper
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  )

/*
* Loop through the values, check their schema compliance and replace base '{ type: "firebase" }' with a promise of
* actual access values.
*/
const schemas = {
  //airbrake:  { projectId: 'string', projectKey: 'string' },
  firebase: {}
}

const opsChecked = oMap( opsRaw, arr => {     // Array of [Promise of] { type: <string>, ... }

  return arr.map( o => {
    const template = schemas[o.type] || (_ => {
      throw new Error(`Unknown ops type: ${o.type}`);
    })();

    check(o, template);
    return o;
  });
});

/*
* Checking utility
*/
function check(o, template) {   // (object, object) => ()   // throws an Error on failures; may print warnings to 'console.warn'

  Object.entries(template).forEach( ([key, tv]) => {
    if (tv.last === '?' && o[key] === undefined) {  // optional value
      // nada
    } else if (tv.startsWith('string')) {
      if (typeof o[key] !== 'string') {
        throw new Error(`Configuration mismatch: expected '.${key}' type to be a string but was: ${typeof o[key]}`);
      }
      //... more types
    /*** REMOVE
    } else {    // 'o' must carry the exact value
      if (o[key] !== tv) {
        throw new Error(`Configuration mismatch: expected '.${key}' to be '${tv}' but was: '${o[key]}'`);
      }***/
    }
  });

  Object.entries(o).forEach( ([key, ov]) => {
    if (!template[key]) {
      if (key !== 'type') {
        throw new Error(`Unexpected key in config: '${key}': ${ov}`);
      }
    }
  });
}

// Note: Vital to have those is plural - they are arrays (i.e. 0 to multiple choices per each)
const perfs = opsChecked.perf;
const logs = opsChecked.logs;
const crashs = opsChecked.crash;

export {
  perfs,
  logs,
  crashs
}
