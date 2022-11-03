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

// CI deployment:             stage matches the ENV (defaults to 'staging')
// Manual deployment (first): -''-
// Manual 'make build && make serve': no stage
// Development and testing: no stage
//
const STAGE = LOCAL ? undefined   //was: (!window.Cypress ? "dev":"dev:test")
  : import.meta.env.VITE_STAGE;   // falsy | e.g. "staging"

const RELEASE = import.meta.env.MODE .startsWith("dev_") ? null : import.meta.env.VITE_RELEASE;    // falsy | "<commit sha>"

// Can do the import here, cannot in a worker. Note: let's make this a static import and get rid of 'import.meta.env.PROJECT_ID'. tbd.
//
const projectId = LOCAL ? import.meta.env.VITE_PROJECT_ID :
  await import("/@firebase.config.json").then( mod => mod.projectId );

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
  const w = new Worker(new URL("./worker.js?project=" + projectId, import.meta.url), { type: 'module' });

  function ctxGen(at) {   // (number) => { uid: string, clientTimestamp: number }
    return {
      uid: auth.currentUser?.uid || null,
      clientTimestamp: at,

      ...STAGE ? { stage: STAGE } : {},
      ...RELEASE ? { release: RELEASE } : {}

      // tbd. browser type, ...
    }
  }

  return {
    flush() {   // () => ()
      w.postMessage({ "":"flush" });
    },
    login(token) {  // (string) => ()
      w.postMessage( { "": "login", token })
    },

    inc(id, inc, at = Date.now()) {   // (string, number, number) => ()
      w.postMessage({ "":"ship", id, inc, ctx: ctxGen(at) });
    },

    log(id, level, msg, args, at = Date.now()) {   // (string, "debug"|"info"|"warn"|"error"|"fatal", string, Array of any, number) => ()
      w.postMessage({ "":"ship", id, level, msg, args, ctx: ctxGen(at) });
    },

    obs(id, obs, at = Date.now()) {    // (string, number, number) => ()
      w.postMessage({ "":"ship", id, obs, ctx: ctxGen(at) });
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
    console.debug(`Token received in ${performance.now() - t0}ms`);   // 2..14ms (old code: 3, 6.2, 7.5 ms)

    currentWorker.login(token);

  } else {
    // End of session: send earlier entries; new worker for the next user

    currentWorker.flush();
    currentWorker = workerGen();    // new worker for the next user (and collecting guest entries, until then)
  }
});

function flush() {    // () => ()
  currentWorker.flush();
}

function createInc(id) {
  return (step = 1.0) => {    // (step: number = 1.0) => ()
    step >= 0.0 || fail(`Bad parameter: ${step}`)

    currentWorker.inc(id, step);

    console.debug("Central counter:", { id, step });
  }
}

function createLog(id, level = "info") {
  return (msg, a) => {    // (string, ?any) => ()
    currentWorker.log(id, level, msg, a);

    console.debug("Central log:", {id, level, msg, a});
  }
}

function createObs(id) {
  return (v) => {   // (number) => ()
    currentWorker.obs(id, v);

    console.debug("Central obs:", {id, v});
  }
}

const createInc_TEST = /*window.Cypress &&*/ ((id) => {
  return (step = 1.0, forcedAt) => {    // (step: number = 1.0, number) => ()
    step >= 0.0 || fail(`Bad parameter: ${step}`)
    currentWorker.inc(id, step, forcedAt || fail());
  }
});

const createLog_TEST = window.Cypress && ((id, level = "info") => {
  return (msg, a, forcedAt) => {    // (string, ?any, number) => ()
    currentWorker.log(id, level, msg, a, forcedAt || fail());
  }
});

const createObs_TEST = window.Cypress && ((id) => {
  return (v, forcedAt) => {   // (number) => ()
    currentWorker.obs(id, v, forcedAt || fail());
  }
});

function fail(msg) { throw new Error(msg); }

export {
  createInc,
  createLog,
  createObs,

  // Cypress helpers:
  createInc_TEST,
  createLog_TEST,
  createObs_TEST,
  flush
}
