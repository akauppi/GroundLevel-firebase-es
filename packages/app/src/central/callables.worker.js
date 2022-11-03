/*
* src/central/callables.worker.js
*
* Background:
*   Tried using 'firebase-functions' and '@firebase/auth' from the worker thread, but didn't learn how to sync the
*   auth status to the worker thread (how to push the auth token to '@firebase/auth'). However, this is not even
*   necessary :) : "callables" are just REST APIs of a certain contract.
*
*   Additional benefit: no dependencies on Firebase libraries, in the worker thread.
*
* Based on:
*   -> https://github.com/akauppi/firebase-jest-testing/blob/master/package/src/firebaseClientLike/httpsCallable.js
*
* References:
*   - Protocol specification for https.onCall (Cloud Functions docs)
*     -> https://firebase.google.com/docs/functions/callable-reference
*/

const LOCAL = import.meta.env.MODE === "dev_local";

// Doesn't work (no import)
//const projectId = LOCAL ? import.meta.env.VITE_PROJECT_ID
//  : await import("/@firebase.config.json").then( mod => mod.projectId );

// "[...], function URLs in Cloud Functions (2nd gen) use a non-deterministic format, meaning you cannot predict
// your function URL before deployment [...]" https://cloud.google.com/functions/docs/concepts/version-comparison#coming_soon_in_2nd_gen
//
// !!! UNTIL v2 again supports predictable "cloudfunctions.net" URLs, THE URL NEEDS TO BE CHANGED, AFTER EACH BACKEND
//    DEPLOYMENT !!!
//
const realCloudFunction = new Map([
  ["metrics-and-logging-proxy-v0", "https://metrics-and-logging-proxy-v0-lhnzrejgbq-lm.a.run.app"]
]);

const functionsBaseURL= (_ => {
  // QUICK FIX since we currently don't need project id in production code. Eventually, make a system where the worker
  // knows the project id, at load time.
  //
  //const projectId = self.PROJECT_ID || fail("Missing 'projectId'!");
  const projectId = import.meta.env.VITE_PROJECT_ID;

  if (LOCAL) {
    const host = import.meta.env.VITE_EMUL_HOST || 'localhost';    // CI overrides it
    const port = import.meta.env.VITE_FUNCTIONS_PORT || fail("no 'VITE_FUNCTIONS_PORT'");
    const REGION = "us-central1";

    return `http://${host}:${port}/${projectId}/${REGION}`;

  } else {
    //const region = import.meta.env.VITE_LOCATION_ID || fail("no 'VITE_LOCATION_ID'");
    //return `https://${region}-${projectId}.cloudfunctions.net`;

    console.warn("Currently, no CloudFunction URL's for v2 functions!");
    return null;
  }
})();

function fail(msg) { throw new Error(msg); }

/*
* Call a Cloud Functions callable.
*
* For the return value, we follow the same '{ data, error }' schema as the 'firebase-functions' API. HOWEVER, errors not
* thrown as 'HttpsError' in the server cause an exception.
*/
function httpsCallableGen(name) {    // (string) => (string) => (any) => Promise of { data?: any, error?: object })

  const uri = !LOCAL ? realCloudFunction.get(name) || fail(`No deployment URL for callable '${name}'`)
    : `${functionsBaseURL}/${name}`;

  // POST
  //    Content-Type: application/json
  //    Authorization: Bearer <token>
  //
  //    body: { data: ... }
  //
  const method = 'POST';

  return token => {
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    }

    return async dataIn => {    // (any) => Promise of any    // rejects if shipment failed
      const body = JSON_stringify_precision_2({ data: dataIn });

      //console.debug( "!!!", { uri, method, headers, body } )    // DEBUG

      const res = await fetch(uri, {method, headers, body }).catch( err => {
        console.error("Fetch failed:", err);    // Jest would show too little
        throw err;
      })

      const status = res.status;

      // 200:
      //
      // 404: Not found
      //    "Not found"
      //    "Function logs_v1 does not exist, valid triggers are: cloudLoggingProxy_v0"
      //
      // 500:
      //    Internal errors (function throws an exception that is not conforming to 'HttpsError' schema)
      //    {"error":{"message":"INTERNAL","status":"INTERNAL"}}
      //
      // 501 and others (*)
      //    {"error":{"details":[1,2,3],"message":"message","status":"UNIMPLEMENTED"}}
      //
      // (*): Errors thrown with 'new functions.https.HttpsError(...)' use various REST API status codes, suitable to
      //    the 'code' parameter given in their constructor. Also "internal" is among the codes, so it may not be possible
      //    to fully differentiate between 'Error' and 'HttpsError', for us.

      if (status === 404) {
        const body = await res.text();
        throw new Error(`Function '${uri}' not found (${status}): '${body}'`);
      }

      const resJson = await res.json();
      const { result, error } = resJson;

      // "If [the error] field is present, then the request is considered failed, regardless of the HTTP status code or
      // whether data is also present."
      //
      // We ignore the 'status' completely in the case of error - because so does the official client.
      //
      // Note: The Firebase documentation mentions that certain types (e.g. Long) may be represented as specific objects.
      //    We don't check for them - they are likely rare in action.
      //
      //    "The client SDKs automatically decode these [fields of 'data' output] into native types according to the
      //    serialization format [...]."
      //
      // If error exists, it's '{ message: string, status: "INVALID_ARGUMENT|..." }'.
      //
      //console.log("!!!", { status, error, result, resJson });

      if (error) {
        throw new Error(`Shipment failed: ${ JSON.stringify(error) }`);
      }

      return result;
    }
  }
}

/*
* A JSONifier where numbers get max. 2 digits.
*
* Avoids values like '22.69999999552965', otherwise seen. Mainly to ease debugging (but of course also for minimizing
* wire transfers).
*/
function JSON_stringify_precision_2(o) {

  return JSON.stringify(o, (_key, x) => (
    typeof x === 'number' ? parseFloat( x.toFixed(2) ) : x
  ));
}

const metricsAndLoggingProxy_v0_Gen = httpsCallableGen("metrics-and-logging-proxy-v0");

export {
  metricsAndLoggingProxy_v0_Gen
}
