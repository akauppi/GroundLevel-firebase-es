/*
* functions/callables/shipInc.js
*
* Proxy for passing central counter increments to a database.
*
* Note:
*   'HttpsError' 'code' values must be from a particular set
*     -> https://firebase.google.com/docs/reference/js/firebase.functions#functionserrorcode
*
* References:
*   - "Callable functions from your app" (Firebase docs)
*     -> https://firebase.google.com/docs/functions/callable
*/
import { regionalFunctions_v1, HttpsError } from '../common.js'
const { https: /*as*/ rf1_https } = regionalFunctions_v1;

import { firestore as db } from '../firebase.js'      // tbd. is this slowing down loading??

import { FieldValue } from 'firebase-admin/firestore'

const COUNTER_PATH="/_counters"

// An arbitrary limit to what's seen as a meaningful number of tags. Each tag potentially causes a new counter in the
// database.
//
const MAX_TAGS = 10;

function failWith(err) { throw err }

/*
* Firestore implementation
*
* NOTE!!!
*   Firestore limits writes to a document to a "sustained write limit of 1/sec". This is fine, for development and
*   proof-of-concept purposes, but won't scale with the user base. (Turn to Realtime Database, then.)
*
* Arrangement:
*   - each named counter has its own document, with fields for subcounters:
*
*   "_counters.{name}": {
*     "=":        // main counter; note: Firestore does not allow an empty string as a key in a document
*     "{k}={v}":  // subcounters
*   }
*
*   - value of each subcounter should remain <= main counter
*   - subcounters are created automatically
*/
async function countersPump(name, subnames, diff) {    // (string, Array of "<tag>=<value>", Number) => ()
  const docRef = db.doc(`${COUNTER_PATH}/${name}`);

  const data = Object.fromEntries( ["=", ...subnames].map( s =>
    [s, FieldValue.increment(diff)]
  ));

  await docRef.set(data, { merge: true });
}

/*
* Ship a single counter entry to the database.
*/
await function shipIncEntry(name, diff, tags) {   // (string, number, { <string>: <any> }) => Promise of ()

  // tbd. Check all input validity (these can be coming from anywhere) - can also be done in the 'landingZone' level.
  //
  if (typeof diff !== 'number') {
    throw new HttpsError('invalid-argument', `Expecting 'diff' to be a number, but got: ${diff}`);
  }

  const subnames = (_ => {    // Array of '{k}={v}'
    const o = (tags === undefined) ? {}
      : (typeof tags !== 'object') ? failWith( new HttpsError('invalid-argument', `Expecting 'tags' to be object, but got: ${tags}`) )
      : (Object.keys(tags).length > MAX_TAGS) ? failWith( new HttpsError('out-of-range', `Too many tags: ${o.size()} > ${MAX_TAGS}`) )
      : tags;

      return Object.entries(o).map( ([k,v]) => `${k}=${v}`);
    })();

    await countersPump(name, subnames, diffNum);
  });

// Can I not write this?
//await db.doc("/some/else").set({ "_": "aaa" });    // DEBUG   // Firestore document cannot have an empty string as key, it seems.

export {
  counterProxy as shipIncEntry
}
