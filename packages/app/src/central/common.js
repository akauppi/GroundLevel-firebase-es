/*
* src/central/common.js
*
* Client side support for sending logs / counter increments to Cloud Functions.
*/
import { getApp } from '@firebase/app'

/*
* To be called _after_ Firebase app is initialized.
*/
const getWorker = (_ => {
  let w;   // Worker

  return () => {
    if (!w) {
      // Pick Firebase app information, to be passed to the Worker.
      //
      // Note: The values may be available as 'meta.import.env.VITE_...' as well, but reading it like this keeps us
      //    a bit detached from the way the app is built.
      //
      const fah = getApp();
      const {
        apiKey,
        projectId,
        locationId    // available if 'main.js' has placed it at initialization
      } = fah.options;

      w = new Worker(new URL('./worker.js', import.meta.url), {
        type: 'module'    // fails 'npm run build' if this is here    <-- tbd. does it, still?
      });

      w.postMessage({
        "": "init",
        apiKey,
        projectId,
        locationId
      });
    }
    return w;
  }
})();

function createLog(id, level = "info") {   // (string, "info"|"warn"|"error"|"fatal"?) => (msg, ...) => ()
  const worker = getWorker();

  return (msg, ...args) => {
    worker.postMessage({ "":"log", id, level, msg, args, at: Date.now() });

    console.debug("Central log:", { id, level, msg, args })
  }
}

function createCounter(id) {
  const worker = getWorker();

  return (diff = 1.0) => {    // (diff: number = 1.0) => ()
    diff >= 0.0 || fail(`Bad parameter (< 0.0): ${diff}`)

    worker.postMessage({ "":"counter", id, diff, at: Date.now() });

    console.debug("Central counter:", { id, diff });
  }
}

function fail(msg) { throw new Error(msg); }

export {
  createLog,
  createCounter,
}
