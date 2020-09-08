/*
* src/init/initOps.js
*
* Initialize the cloud based monitoring system the project has configured (currently only support Airbrake).
*/
assert(!LOCAL, "Cloud based monitoring tried with 'dev:local'. Not allowed." )

import { Notifier } from "@airbrake/browser"    // works for Vite (not for Rollup 2.6.11)
//import { Notifier } from "@airbrake/browser/dist/index"

const mode = import.meta.env.MODE;
assert( mode === 'production' || mode === 'development', `Unexpected MODE: ${mode}` );

import { ops } from '../config.js'

const { projectId, projectKey } = ops;

let logGen;

if (! (projectId && projectKey)) {
  // tbd. use Toast!! 🥪
  console.warn("'ops.projectId' and/or 'ops.projectKey' not provided - NOT using ops monitoring!!!")

  logGen = _ => undefined;

} else {
  // tbd. Would be nice to be able to provide version / build info here.

  const airbrake = new Notifier({
    projectId,
    projectKey,
    environment: mode   // 'production'|'development'
  });
  window.airbrake = airbrake;

  logGen = level => (msg, opt) => {   // (string) => (string, object|undefined) => ()
    // Q: is there a way to provide severity for Airbrake textual messages?

    const s = `[${ level.toUpperCase() }] ` +
      opt ? `${msg}: ${opt}` : msg;   // anything JSON within the string is taken as parameters

    airbrake.notify(s)
      .then(notice => {
        if (notice.id) {
          console.info('notify successful, id:', notice.id);
        } else {
          console.error('notify failed', notice.error);
        }
      });
  }

  // tbd. Toast an info, just because/once we can!!!
}

window.logs = {
  debug: logGen('debug'),
  info: logGen('info'),
  warn: logGen('warn'),
  error: logGen('error'),
  fatal: logGen('fatal')
};

export { }
