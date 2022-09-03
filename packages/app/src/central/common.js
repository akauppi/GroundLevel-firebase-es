/*
* src/central/common.js
*
* Client side support for sending logs / counter increments to Cloud Functions.
*
* APPROACH:
*   Each user session gets a dedicated worker just for those messages. This is mainly to keep state management simple.
*   Tried also changing the token of a single worker.
*
* References:
*   - Vite > Web Workers
*     -> https://vitejs.dev/guide/features.html#web-workers
*/
import {getAuth, onAuthStateChanged} from '@firebase/auth'

let workerProxyProm;  // undefined: no current user
                      // Promise of { flush, inc, log }: have a way / going to get one "soon" (~<10ms)

const auth = getAuth();

/*
* Create a worker, equipped with a certain token.
*
* Note:
*   The whole worker interface is within this function, keeping it tight.
*/
function workerGen(token) {   // (string) => { flush(), inc(id: string, diff: number), log(id: string, level: "debug"|"info"|"warn"|"error"|"fatal", msg: string, ...args: Array of any) }

  // Note: Vite (3.0.9) does not allow string interpolation (`...${some}`) within the worker thread URL:
  //  <<
  //    9:36:10 PM [vite] Internal server error: `new URL(url, import.meta.url)` is not supported in dynamic template string.
  //  <<
  //
  //    It is okay with using '"..."+token'. Beats the author. fine with it!
  //
  //const w = new Worker(new URL(`./worker.js?token=${token}`, import.meta.url), {type: 'module'});   // FAILS
  const w = new Worker(new URL('./worker.js?token='+token, import.meta.url), { type: 'module' });

  return {
    flush(final = false) {   // (boolean) => ()
      w.postMessage({ "":"flush" })

      /**
      // Trying to help JavaScript GC to release the resource (Q: any better way / pattern?); could also just let be..
      if (final) {
        w = null;
      }**/
    },

    inc(id, diff, testOpts) {   // (string, number) => ()
      w.postMessage({ "":"inc", id, diff, at: testOpts?.forcedAt || Date.now() });
    },

    log(id, level, msg, args, testOpts) {   // (string, "debug"|"info"|"warn"|"error"|"fatal", string, Array of any) => ()
      w.postMessage({ "":"log", id, level, msg, args, at: testOpts?.forcedAt || Date.now() });
    },

    obs(id, v, testOpts) {    // (string, number) => ()
      w.postMessage({ "":"obs", id, v, at: testOpts?.forcedAt || Date.now() });
    }
  }
}

/*
* Watch the user logging in/out. 'workerProxyProm' provides access to the current user's metrics/logs writes.
*
* This prepares 'workerProxyProm' to the task, even before a metric/log write is called. In practise, the first
* log may come really fast; before the Promise is ready.
*/
onAuthStateChanged( auth, user => {
  console.debug("!!! [CENTRAL]: auth", { uid: user?.uid });    // DEBUG

  if (user === undefined) return;

  if (user) {
    (!workerProxyProm) || fail("No break between two users.");    // should have been 'null' in between

    const t0 = performance.now();

    console.debug("!!! [CENTRAL]: Fetching token...");

    workerProxyProm = user.getIdToken().then(token => {    // free-running tail
      console.debug(`Token received in ${performance.now() - t0}ms`);   // 3, 6.2, 7.5 ms
      return workerGen(token);
    });

  } else {
    if (workerProxyProm) {
      workerProxyProm.then( wp => { wp.flush(true) } );
    }
    workerProxyProm = null;
  }
});

async function getWorker() {    // () => Promise of { flush, inc, log }
  return workerProxyProm ||
    fail("");
}

/*
* Flush the outgoing buffers, e.g. if the user is about to log out.
*/
function flush() {    // () => ()
  getWorker().then( x => {
    x.flush()
  });
}

function createCounter(id) {
  return (diff = 1.0, testOpts) => {    // (diff: number = 1.0, ?{ forcedAt: number }) => ()
    diff >= 0.0 || fail(`Bad parameter: ${diff}`)

    getWorker().then( x => {
      x.inc(id, diff, testOpts);

      console.debug("Central counter:", { id, diff });
    });
  }
}

function createLog(id, level = "info", testOpts) {   // (string, ?"info"|"warn"|"error"|"fatal", ?{ forcedAt: number }) => (msg, ...) => ()
  return (msg, ...args) => {
    getWorker().then( x => {
      x.log(id, level, msg, args, testOpts);

      console.debug("Central log:", {id, level, msg, args});
    });
  }
}

function createObs(id) {
  return (v, testOpts) => {   // (number, ?{ forcedAt: number }) => ()
    getWorker().then( x => {
      x.obs(id, v, testOpts);

      console.debug("Central obs:", {id, v});
    });
  }
}

function fail(msg) { throw new Error(msg); }

export {
  createCounter,
  createLog,
  createObs,
    //
  flush
}
