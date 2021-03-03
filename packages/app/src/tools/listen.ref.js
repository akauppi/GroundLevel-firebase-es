/*
* src/data/listen.ref.js
*
* Tools to turn Firebase doc, collection and query subscription into the UI framework's reference model.
*/
import { collection, query, onSnapshot, QueryConstraint } from 'firebase/firestore'
  //
  // Firebase @exp note: 'onSnapshot' brings in following both for references, and queries

import { mapRef } from './mapRef'
import {shallowRef} from 'vue'

import { assert } from './assert'

// Generator for listening of collections and queries.
//
// - convert dates to JavaScript 'Date' (Firebase ~~c~~should do it!)
// - do application specific conversions if 'conv' options is provided
//
function mapRefSetterGen({ conv }) {   // ({ conv: (obj) => obj|null }) => [Ref of undefined | { <key>: any }, (QuerySnapshot) => ()]
  const [ref, setN] = mapRef();
  const conv2 = conv | (x => x);

  function f(ss) {
    const kvs = ss.docChanges().map( (change) => {
      debugger;

      const tmp = (change.type !== 'removed') ? change.doc.data() : null;
      const v = tmp ? conv2(tmp) : undefined;

      const k = change.id;
      return [k,v];
    });

    setN(kvs);
  }

  return [ref,f];
}

/*
* Subscribe to a Firebase Firestore collection.
*/
function _listenC(db, collectionPath, opts ) {    // (Firestore, string, { conv?: obj => obj? }?) => [Ref of Map of string -> string|bool|number|..., () => ()]
  const { conv } = opts || {};

  const coll = collection(db, collectionPath);

  const [ref, f] = mapRefSetterGen({ conv });
  const unsub = onSnapshot(coll, f, err => {
    central.error(`Failed to listen to '${collectionPath}':`, err);
  });

  return [ref,unsub];
}

/*
* Subscribe to a Firebase Firestore query.
*/
function _listenQ(db, collectionPath, qc, opts ) {    // (Firestore, string, QueryConstraint, { conv?: obj => obj? }?) => [Ref of Map of string -> string|bool|number|..., () => ()]
  const { conv } = opts || {};

  const coll = collection(db, collectionPath);
  const q = query(coll,qc);

  debugger;
  console.debug("Starting to follow:", { collectionPath, qc });   // DEBUG

  const [ref, f] = mapRefSetterGen({ conv });
  const unsub = onSnapshot(q, f, err => {
    central.error(`Failed to listen to '${collectionPath}' with  constraint '${qc}':`, err);
  });

  return [ref,unsub];
}

/*
*
*/
function listenC(db, collectionPath, ...args) {    // (Firestore, string, QueryConstraint?, { conv?: obj => obj? }?) => [Ref of Map of string -> string|bool|number|..., () => ()]

  debugger;
  if (args[0] instanceof QueryConstraint) {
    const [qc, opts] = [...args];
    return _listenQ(db, collectionPath, qc, opts)
  } else {
    const opts = args[0];
    return _listenC(db, collectionPath, opts)
  }
}

/*
* Follow a certain Firestore document as a 'Ref'.
*
* opt: {
*   context: string   // describes the subscription; used in error messages
* }
*
* Note that we leave out the metadata Firebase provides, and just pass the document itself further.
*
* Returns a pair:
*   [0]: Ref that updates as the document does; 'undefined' until database connection established; 'null' for no document
*   [1]: unsub function
*/
function docRef(_D) {   // ( DocumentReference ) => [Ref of undefined | null | { ..document fields }, () => ()]
  const ref = shallowRef();

  const unsub = onSnapshot( _D, (ss) => {
    console.debug("!!! Listened to:", ss )

    const data = ss.data();
    ref.value = data ? convTimestamps(data) : null;

  }, (err) => {   // (FirestoreError) => ()
    central.error(`Failure listening to '${_D.path}':`, err);
  });

  return [ref, unsub];
}

/*
* Convert values of 'Timestamp'[1] to JavaScript native 'Date', for easier consumption.
*
* Note: This is only a shallow scan: 'Timestamp' fields within maps are currently not converted.
*
* [1]: https://modularfirebase.web.app/reference/firestore_.timestamp
*
* Timestamp: [2]
*   {
*     // Represents seconds of UTC time since Unix epoch
*     // 1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
*     // 9999-12-31T23:59:59Z inclusive.
*     int64 seconds;
*
*     // Non-negative fractions of a second at nanosecond resolution. Negative
*     // second values with fractions must still have non-negative nanos values
*     // that count forward in time. Must be from 0 to 999,999,999
*     // inclusive.
*     int32 nanos;
*   }
*
* [2]: https://github.com/google/protobuf/blob/master/src/google/protobuf/timestamp.proto
*/
function convTimestamps(o) {
  return oMap(o, v => v.toDate ? v.toDate() : v);
}

function oMap(o,vf) {
  const arr = Object.entries(o).map(vf);
  return Object.fromEntries(arr);
}

export {
  listenC,
  docRef
}
