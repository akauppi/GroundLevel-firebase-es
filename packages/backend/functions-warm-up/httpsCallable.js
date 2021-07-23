/*
* ADAPTED FROM 'firebase-jest-testing' src/firebaseClientLike/httpsCallable.js
*
* References:
*   - Protocol specification for https.onCall (Cloud Functions docs)
*     -> https://firebase.google.com/docs/functions/callable-reference
*/
import fetch from 'node-fetch'

import { FUNCTIONS_URL, projectId } from './config.js'

const region = "us-central1";    // in emulation, our functions run in the default region (doesn't need to be so...)

/*
* Call a Cloud Functions callable.
*
* The API is intended to be close to Firebase JS SDK client API, but we omit the first parameter ('functions' handle)
* as unnecessary.
*
* For the return value, we follow the same '{ data, error }' schema as the official API. HOWEVER, errors not thrown
* as 'HttpsError' in the server cause an exception (and presumably fail of test).
*/
function httpsCallable(name) {    // (string) => ((data) => Promise of { data: any|undefined, error: object|undefined ))

  if (arguments.length > 1) {
    throw new Error(`'httpsCallable'-like does not use the functions handle argument. Called with: ${arguments}`);
  }

  const uri = `${FUNCTIONS_URL}/${projectId}/${region}/${name}`;

  // POST
  //    Content-Type: application/json
  //    Authorization: Bearer <token>
  //
  //    body: { data: ... }
  //
  const method = 'POST';
  const token = null;

  return async (dataIn) => {    // (any) => Promise of X
    const body = JSON.stringify({ data: dataIn });
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    }

    const res = await fetch(uri, {method, headers, body });

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
    // Note: The Firebase documentation mentions that certain types (eg. Long) may be represented as specific objects.
    //    We don't check for them - they are likely rare in action.
    //
    //    "The client SDKs automatically decode these [fields of 'data' output] into native types according to the
    //    serialization format [...]."
    //
    //console.log("!!!", { status, data, error, result, resJson });

    // Since the Firebase JS SDK client provides '{ data, error }' (it converts wire 'result' to the 'data' field),
    // so do we.
    //
    return { data: result, error };
  }
}

export { httpsCallable }
