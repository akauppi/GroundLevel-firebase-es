/*
* primeData/commit-set.js
*
* Adapted from 'firebase-jest-testing' 'commit.js'. Only supports set without transforms.
*
* References:
*
*   - SO question from 2018 (with one answer!):
*     -> https://stackoverflow.com/questions/53943408/firestore-rest-api-add-timestamp
*   - commit API
*     -> https://firebase.google.com/docs/firestore/reference/rest/v1/projects.databases.documents/commit
*     -> https://firebase.google.com/docs/firestore/reference/rest/v1/Write
*/
import { strict as assert } from 'assert'
import fetch from 'node-fetch'

import { firestorePort, host } from '../config.js'

/*
* Carry out writes to Firestore.
*
* These are applied atomically.
*
* Resolves to 'true' if (all) access is granted, or an error message, describing why the access failed (as received from
* the emulator's response).
*/
async function commit_v1(projectId, token, writes) {   // (string, string, Array of Write) => Promise of true|string
  const path_v1 = `http://${host}:${firestorePort}/v1/projects/${projectId}/databases/(default)/documents`;

  const [method, uri] = ['POST', `${path_v1}:commit`];

  const body = JSON.stringify({
    writes
  });

  const res = await fetch(uri, {method, headers: { "Authorization": `Bearer ${token}` }, body })
  const status = res.status;

  // Access:
  //    200 with an empty JSON body ({\n}) if writes succeeded
  //
  // No access:
  //    403 (Forbidden) with body (white space added for clarity):
  //      { "error": { "code": 403, "message": "\nfalse for 'create' @ L262", "status":"PERMISSION_DENIED" } }

  if (status === 200) {   // no need to check for 2xx
    return true;

  } else if (status === 403) {   // access denied
    const json = await res.json();
    const s = json.error.message || fail("No 'error.message' in denied response from emulator.");
    return s;

  } else {    // other status codes
    const body = await res.text();
    const msg = `Unexpected response from ${method} ${uri} (${status}): ${body}`;
    throw new Error(msg);
  }
}

/*
* Convert a JSON object into a 'MapValue':
*
*   {
*     fields: {
*       "some-key": {  // Value:
*         nullValue: null
*         | booleanValue: boolean
*         | integerValue: string        // not used by us (shipping numbers always as double)
*         | doubleValue: number
*         | timestampValue: string      // RFC3339 format
*         | stringValue: string         // UTF-8
*         | bytesValue: string          // base64 encoded; not used by us
*         | geoPointValue: LatLng       // not implemented (please do, if needed)
*         | arrayValue: { values: Array of Value }    // except no support for array of arrays
*         | mapValue: { fields: { <key>: Value } }
*       }
*       , ...
*     }
*   }
*
* Note: Undefined values are simply skipped.
*
* See:
*   https://firebase.google.com/docs/firestore/reference/rest/v1/projects.databases.documents#Document
*   https://firebase.google.com/docs/firestore/reference/rest/v1/Value
*/
function mapValue(o) {    // (object) => { fields: ... }
  assert(typeof o === 'object');

  const pairs = Object.entries(o).map(([k, v]) => {
    if (v === undefined) { return null }    // skip fields with 'undefined' value

    return [k, value(v)]
  }).filter( x => x );
  const fields = Object.fromEntries(pairs);

  return { fields };
}

function value(v) {   // (any) => { nullValue: null | ... }

  switch( typeof v ) {
    case 'boolean': return { booleanValue: v }
    case 'number': return Number.isInteger(v) ? { integerValue: v.toString() }  // [2]
      : { doubleValue: v }
    case 'string': return { stringValue: v }

    case 'object':    // null,Date,
      if (v === null) return { nullValue: null }
      if (Array.isArray(v)) return { arrayValue: arrayValue(v) };
      if (v instanceof Date) return { timestampValue: v.toISOString() }

      return { mapValue: mapValue(v) };
  }

  // [2]: Important that integers are presented this way. Matters eg. to Security Rules being able to use 'is int'.
}

function arrayValue(a) {  // (Array of any /*except Array*/) => { values: Array of Value }
  return { values: a.map(value) };
}

export {
  commit_v1,
  mapValue
}
