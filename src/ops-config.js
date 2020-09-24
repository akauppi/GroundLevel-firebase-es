/*
* src/ops-config.js
*
* Ops configuration
*
* Forward note: This is separate from 'config.js' since the author plans to split the app part COMPLETELY AWAY
*   into a separate repository.
*/

// Account specific values (note: not really secrets, they are available to anyone having access to the front end)
import { airbrake, firebase } from '../.env.js'

// Schema checking
//
// Note: We may be able to use Typescript for these, eventually. Now the aim is simply to simplify code using us.
//
check( airbrake, { type: 'airbrake', projectId: 'string', projectKey: 'string' } );
check( firebase, { type: 'firebase', apiKey: 'string', appId: 'string?', projectId: 'string', authDomain: 'string' } );

//--- Logging config

import { testDebug, testWarn } from './logging.js'
const toastThese = new Set([ testDebug, testWarn ]);

const _PROD = (import.meta.env?.MODE || 'production') === 'production';

const ops = {
  perf: [firebase],
  logs: _PROD ? [] : [airbrake],    // DISABLED for prod
  fatal: _PROD ? [] : [airbrake],   // DISABLED for prod

  toastThis(id) {   // (obj) => boolean
    return toastThese.has(id);
  }
}

function check(o, template) {   // (object, object) => ()   // throws an Error on failures; may print warnings to 'console.warn'

  if (Object.keys(airbrake).length === 0) {   // {}: allowed as a "skip" object
    return;

  } else {
    Object.entries(template).forEach( ([key, tv]) => {
      if (tv.last === '?' && o[key] === undefined) {  // optional value
        // nada
      } else if (tv.startsWith('string')) {
        if (typeof o[key] !== 'string') {
          throw new Error(`Configuration mismatch: expected '.${key}' type to be a string but was: ${typeof o[key]}`);
        }
        //... more types
      } else {    // 'o' must carry the exact value ("airbrake", ...)
        if (o[key] !== tv) {
          throw new Error(`Configuration mismatch: expected '.${key}' to be '${tv}' but was: '${o[key]}'`);
        }
      }
    });

    Object.entries(o).forEach( ([key, ov]) => {
      if (!template[key]) {
        throw new Error(`Unexpected key in config: '${key}': ${ov}`);
      }
    });
  }
}

export {
  ops
}
