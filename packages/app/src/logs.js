/*
* src/logs.js
*
* Logs and counters.
*
* Client side support for sending logs / counter increments to Cloud Functions.
*/
import { getApp } from '@firebase/app'

//function fail(msg) { throw new Error(msg); }

let myWorker;

/*
* To be called _after_ Firebase app is initialized.
*/
function lazyInit() {   // () => Worker
  if (!myWorker) {
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

    const worker = new Worker(new URL('./logs.worker.js', import.meta.url), {
      type: 'module'    // fails 'npm run build' if this is here
    });

    worker.postMessage({ "":"init",
      apiKey,
      projectId,
      locationId
    });

    myWorker = worker;
  }

  return myWorker;
}

function createLog(id, level = "info") {   // (string, "info"|"warn"|"error"|"fatal"?) => (msg, ...) => ()
  const worker = lazyInit();

  //console.debug("!!! Creating log:", { id });

  return (msg, ...args) => {
    worker.postMessage({ "":"log", id, level, msg, args });

    console.debug("Central log:", { id, msg, level, args })
  }
}

function createCounter(id) {
  const worker = lazyInit();

  //console.debug("!!! Creating counter:", { id });

  return (diff = 1.0) => {    // (diff = 1.0) => ()
    //tbd. worker.postMessage({ "":"counter", id, diff });

    console.debug("Changing counter:", { id, diff });
  }
}

const logHey = createLog("hey!");

const countSessions = createCounter("sessions");

export {
  logHey,
  countSessions
}
