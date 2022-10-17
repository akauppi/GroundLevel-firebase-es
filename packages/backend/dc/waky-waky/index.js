/*
* dc/waky-waky/index.js
*
* Helper to tease Callable API open.
*
* After the emulators are launched, this happens:
*
*   - for some seconds, the Callables URL provides 404 - it is still initializing, though the port itself is opened
*     (it could be made different, setting things up first, only then opening the port).
*   - the first 200 reply takes ~2500 ms
*   - subsequent 200 replies come in ~50..70 ms
*
* The job of this script is to call the Callable interface, until a function is clearly awake. This makes later testing
* more reproducible (= "less surprises").
*
* Usage:
*   <<
*     $ PROJECT_ID=demo-main EMUL_HOST=... node dc/waky-waky/index.js {metricsAndLoggingProxy_v0|...}
*   <<
*/
//import { createUnsecuredJwt } from './createToken.js'
import { projectId, emulHost, functionsPort } from './config.js'

function fail(msg) { throw new Error(msg) }

const [functionName] = process.argv.slice(2);

if (!functionName) {
  process.stderr.write(`Usage: EMUL_HOST=... node ${ process.argv[1] } <functionName>\n`);
  process.exit(5);
}

/*
* Note: It doesn't matter, whether we get 200's or not (400's for bad arguments are fine; they'll already wake up the
*     callables. However, to avoid unnecessary server-side logging (within emulation), we use a special payload string
*     to indicate waking up.
*/
const WAKEUP_DATA = "wakeup";

const SUCCESS_THRESHOLD_ms = 500;

/*
* Post a payload to a callable end point.
*/
async function postOne(name, token, o) {
  const url = `http://${ emulHost }:${ functionsPort }/${ projectId }/us-central1/${ name }`;

  const headers = {
    ...token ? { "Authorization": `Bearer ${token}` } : {},
    "Content-Type": "application/json"
  };

  const tmp = await fetch( url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ data: o })   // wrapping things in 'data' = Callable protocol
  })
  return tmp;
}

/*
* Loop with requests, until we get a 2xx fast enough.
*
* Observed behaviour ('firebase-tools' 11.14.2):
*   <<
*     Received 404's for 3037ms
*     Received 200 in 2698ms
*     Received 200 in 8ms
*   <<
*/
await (async _ => {
  const t00 = performance.now();
  const token = null;

  let firstWave = true;
  let seen404s = false;

  while(true) {
    const t0 = performance.now();

    const { status } = await postOne(functionName, token, WAKEUP_DATA);
    const dt = performance.now() - t0;

    // Received responses:
    //    - 404, in 3..8ms    // the Callables system is still initializing; wait
    //    - 200, in ~2500ms   // initial call to a Callables; creates the function (they are Cold By Default!!! ❄️🌨🧊🧊🧊)
    //    - 200, in ~5ms      // ok :)
    //
    if (firstWave) {
      if (status === 404) {
        await timeoutMs(10);
        seen404s = true;
        continue;   // carry on listening to the next
      }

      if (seen404s) {
        const tmp = performance.now() - t00 - dt;
        process.stdout.write(`Received 404's for ${ tmp |0 }ms\n`);
      }
      firstWave = false;
    }

    process.stdout.write(`Received ${ status } in ${ dt |0 }ms\n`);

    if (status !== 200) {
      process.stderr.write(`[INTERNAL] Unexpected status: ${ status } != 200`);
      process.exit(8);

    } else if (dt < SUCCESS_THRESHOLD_ms) {
      break;
    }
    // carry on (likely after the first 200)
  }
})();

function timeoutMs(ms) { return new Promise((resolve) => { setTimeout(resolve, ms); }); }
