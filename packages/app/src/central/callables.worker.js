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

const PROJECT_ID = import.meta.env.VITE_PROJECT_ID || fail("no 'VITE_PROJECT_ID'");

const functionsBaseURL= (_ => {
  const LOCAL = import.meta.env.MODE === "dev_local";

  if (LOCAL) {
    const host = import.meta.env.VITE_EMUL_HOST || 'localhost';    // CI overrides it
    const port = import.meta.env.VITE_FUNCTIONS_PORT || fail("no 'VITE_FUNCTIONS_PORT'");
    const REGION = "us-central1";
    return `http://${host}:${port}/${PROJECT_ID}/${REGION}`;

  } else {
    const region = import.meta.env.VITE_LOCATION_ID || fail("no 'VITE_LOCATION_ID'");

    return `https://${region}-${PROJECT_ID}.cloudfunctions.net`;
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

  const uri = `${functionsBaseURL}/${name}`;

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

    return async dataIn => {    // (any) => Promise of { data?, error? }
      const body = JSON.stringify({ data: dataIn });

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
      // We ignore the 'status' completely - because so does the official client. Just pass '{ data, error }' to the caller.
      //
      // Note: The Firebase documentation mentions that certain types (e.g. Long) may be represented as specific objects.
      //    We don't check for them - they are likely rare in action.
      //
      //    "The client SDKs automatically decode these [fields of 'data' output] into native types according to the
      //    serialization format [...]."
      //
      //console.log("!!!", { status, data, error, result, resJson });

      // The Firebase JS SDK client provides '{ data, error }' (it converts wire 'result' to the 'data' field).
      //
      return { data: result, error };
    }
  }
}

const metricsAndLoggingProxy_v0_Gen = httpsCallableGen("metricsAndLoggingProxy_v0");

export {
  metricsAndLoggingProxy_v0_Gen
}
