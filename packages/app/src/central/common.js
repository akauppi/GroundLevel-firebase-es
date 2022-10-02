/*
* src/central/common.js
*
* Client side support for sending increments, logs and samples to Cloud Functions.
*
* APPROACH:
*   Each user session gets a dedicated worker just for those messages. This is mainly to keep state management simple.
*   Such a worker is created already during non-authenticated time; entries queued during non-authenticated time are
*   sent once/if the user authenticates. This is necessary for example for the initialization measurements.
*
* References:
*   - Vite > Web Workers
*     -> https://vitejs.dev/guide/features.html#web-workers
*/
import {getAuth, onAuthStateChanged} from '@firebase/auth'

const LOCAL = import.meta.env.MODE === "dev_local";

const auth = getAuth();

/*
* Create a worker, for current guest and upcoming user.
*
* Note:
*   The whole worker interface is within this function, keeping it tight.
*/
function workerGen() {   // () => { flush, login, inc, log, obs }

  // Note: If passing dynamically created query parameters to the worker, use '+' instead of string interpolation
  //    (but we don't need query params).
  //
  const w = new Worker(new URL("./worker.js", import.meta.url), { type: 'module' });

  function ctxGen(forcedAt) {   // (number?) => { uid: string, clientTimestamp: number }
    const at = forcedAt || Date.now();

    return {
      uid: auth.currentUser?.uid,
      clientTimestamp: at

      // tbd. Other context: release, ...
    }
  }

  return {
    flush() {   // () => ()
      w.postMessage({ "":"flush" });
    },
    login(token) {  // (string) => ()
      w.postMessage( { "": "login", token })
    },

    inc(id, inc, testOpts) {   // (string, number) => ()
      w.postMessage({ "":"ship", id, inc, ctx: ctxGen(testOpts?.forcedAt) });
    },

    log(id, level, msg, args, testOpts) {   // (string, "debug"|"info"|"warn"|"error"|"fatal", string, Array of any) => ()
      w.postMessage({ "":"ship", id, level, msg, args, ctx: ctxGen(testOpts?.forcedAt) });
    },

    obs(id, obs, testOpts) {    // (string, number) => ()
      w.postMessage({ "":"ship", id, obs, ctx: ctxGen(testOpts?.forcedAt) });
    }
  }
}

let currentWorker = workerGen();    // { login, flush, inc, log, obs }

/*
* Watch the user logging in/out.
*/
onAuthStateChanged( auth, async user => {
  //console.debug("!!! [CENTRAL]: auth", { uid: user?.uid });    // DEBUG

  if (user === undefined) {
    // nada

  } else if (user) {
    // Existing worker is without a user: provide one (will deliver pending guest-data and new one)

    const t0 = performance.now();

    const token = await user.getIdToken();
    console.debug(`Token received in ${performance.now() - t0}ms`);   // (old code: 3, 6.2, 7.5 ms)

    currentWorker.login(token);

  } else {
    // End of session: send earlier entries; new worker for the next user

    currentWorker.flush();
    currentWorker = workerGen();    // new worker for the next user (and collecting guest entries, until then)
  }
});

/*
* Flush the outgoing buffers, e.g. if the user is about to log out.
*_/
function flush() {    // () => ()
  currentWorker.flush();
}*/

function createCounter(id) {
  return (step = 1.0, testOpts) => {    // (step: number = 1.0, ?{ forcedAt: number }) => ()
    step >= 0.0 || fail(`Bad parameter: ${step}`)

    currentWorker.inc(id, step, testOpts);

    console.debug("Central counter:", { id, step });
  }
}

function createLog(id, level = "info") {
  return (msg, a, testOpts) => {    // (string, ?any, ?{ forcedAt: number }) => ()
    currentWorker.log(id, level, msg, a, testOpts);

    console.debug("Central log:", {id, level, msg, a});
  }
}

function createObs(id) {
  return (v, testOpts) => {   // (number, ?{ forcedAt: number }) => ()
    currentWorker.obs(id, v, testOpts);

    console.debug("Central obs:", {id, v});
  }
}

function fail(msg) { throw new Error(msg); }

// Help Cypress testing by preparing some entries.
//
if (LOCAL && window.Cypress) {
  window.TEST_countDummy = createCounter("test-dummy");
  window.TEST_logDummy = createLog("test-dummy", "info");
  window.TEST_obsDummy = createObs("test-dummy");
}

export {
  createCounter,
  createLog,
  createObs,
    //
  //flush
}
