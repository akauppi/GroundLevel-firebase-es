/*
* src/data/listen.ref.js
*
* Tools to turn Firebase doc, collection and query subscription into the UI framework's reference model.
*/
import { query, onSnapshot, QueryConstraint, Timestamp } from 'firebase/firestore'
  //
  // Firebase @exp note: 'onSnapshot' brings in following both for references, and queries

import {shallowRef, triggerRef} from 'vue'

import { assert } from './assert'

/*
* Follow a certain collection, or query, as a 'Ref of Map'.
*/
function collRef(_C, ...args) {    // (CollectionReference, QueryConstraint?, { conv?: obj => obj? }?) => [Ref of Map of string -> string|bool|number|..., () => ()]
  const [qc,opts] = (args.length >= 1 && args[0] instanceof QueryConstraint) ? [...args]
    : [undefined,args[args.length-1]];

  const { conv } = opts;

  const [ref, ssHandler] = mapRefHandlerGen({ conv });
  let unsub;

  if (qc) {
    const q = query(_C,qc);
    unsub = onSnapshot(q, ssHandler, err => {
      central.error(`Failed to listen to '${_C.path}' with  constraint '${qc}':`, err);
    });

  } else {
    unsub = onSnapshot(_C, ssHandler, err => {
      central.error(`Failed to listen to '${_C.path}':`, err);
    });
  }

  return [ref,unsub];
}

// Generator for listening of collections and queries, and representing the set of documents as 'Ref of Map'.
//
// - convert time stamps to JavaScript 'Date' in the data
// - application specific conversions if 'conv' option is provided
//
// Note: This code can be simplified by having just one flow (one call of 'onSnapshot'); the current splitting is
//    thinking that maybe following a query or a collection could be different functions, in the evolving '@exp' API.
//
function mapRefHandlerGen({ conv }) {   // ({ conv: (obj) => obj|null }) => [Ref of undefined | Map of <key> -> { ..document }, (QuerySnapshot) => ()]

  // Note: Even if we loop the changes, and set them one by one, the Vue.js reactivity system will cause only one
  //    trigger (no need to make the change batch atomic).
  //
  const ref = shallowRef( new Map() );

  const appConv = conv || (x => x);

  function docConv(o) {
    // convert time stamps to 'Date' first
    return appConv( convTimestamps(o) );
  }

  function f(qss) {    // (QuerySnapshot) => ()
    qss.docChanges().forEach( (change) => {
      const tmp = change.doc;
      const [k,data] = [tmp.id, tmp.data()];

      if (!data) {
        assert( change.type === 'removed' );
        ref.value.delete(k);
      } else {
        const v = docConv(data);
        if (v) {
          ref.value.set(k, v);
        } else {
          ref.value.delete(k);    // removed by the conversion
        }
      }
    });

    // Need to manually trigger the change; our efforts didn't assign to 'ref.value'.
    //
    console.debug("!!! triggering")   // DEBUG
    triggerRef(ref);
  }

  return [ref,f];
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
  const o2= oMap(o, v => {
    return v instanceof Timestamp ? v.toDate() : v;
  });
  return o2;
}

function oMap(o,vf) {
  const arr = Object.entries(o).map(([k,v]) => [k, vf(v)]);
  return Object.fromEntries(arr);
}

export {
  collRef,
  docRef
}
