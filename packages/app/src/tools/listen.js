/*
* src/tools/listen.js
*
* Subscribe to a Firebase collection, document, or query.
*/
import { doc, collection, query, where, onSnapshot } from 'firebase/firestore'
  //
  // Firebase @exp note: 'onSnapshot' brings in following both for references, and queries

import { mapRef } from './mapRef'
import {ref as vueRef} from "vue";

import { assert } from '/@/assert'

// Generator for listening of collections and queries.
//
// - convert dates to JavaScript 'Date' (Firebase ~~c~~should do it!)
// - do application specific conversions if 'conv' options is provided
//
function ref_f_gen({ conv }) {   // ({ conv: (obj) => obj|null }) => [Ref of undefined | { <key>: any }, (QuerySnapshot) => ()]
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
function _listenC(db, collectionPath, opt ) {    // (Firestore, string, { conv?: obj => obj? }?) => [Ref of Map of string -> string|bool|number|..., () => ()]
  const { conv } = opt || {};

  const coll = collection(db, collectionPath);

  const [ref, f] = ref_f_gen({ context, conv });
  const unsub = onSnapshot(coll, f, err => {
    central.error(`Failed to listen to '${collectionPath}':`, err);
  });

  return [ref,unsub];
}

/*
* Subscribe to a Firebase Firestore query.
*/
function _listenQ(db, collectionPath, qc, opt ) {    // (Firestore, string, QueryConstraint, { conv?: obj => obj? }?) => [Ref of Map of string -> string|bool|number|..., () => ()]
  const { conv } = opt || {};

  const coll = collection(db, collectionPath);
  const q = query(coll,qc);

  const [ref, f] = ref_f_gen({ conv });
  const unsub = onSnapshot(q, f, err => {
    central.error(`Failed to listen to '${collectionPath}' with query '${ qcArr.join() }':`, err);
  });

  return [ref,unsub];
}

/*
*
*/
function listenC(db, collectionPath, ...args) {    // (Firestore, string, QueryConstraint?, { conv?: obj => obj? }?) => [Ref of Map of string -> string|bool|number|..., () => ()]

  if (args.length > 1) {
    const [qc, opts] = [...args];
    return _listenQ(db, collectionPath, qc, opts)
  } else {
    const opts = args[0];
    return _listenC(db, collectionPath, opts)
  }
}

/*
* Follow a certain Firestore document as Vue.js 3 'Ref'.
*
* The value is 'undefined' until the database connection has been established (alternatively, we could return a Promise).
*
* opt: {
*   context: string   // describes the subscription; used in error messages
* }
*/
function listenD( db, docPath ) {   // ( FirebaseFirestore, "{collectionPath}/{documentId}" ) => [Ref of undefined | { ..firestore doc }, () => ()]

  const [_,a,b] = docPath.match(/(.+)\/(.+?)/);
  assert(a && b, `Bad Firebase document path: ${docPath}`);

  const dRef = doc( collection(db,a), b);

  const ref = vueRef();

  const unsub = onSnapshot( dRef, (dss) => {
    console.debug("!!! Listened to:", dss )
    debugger;

    ref.value = dss;
  }, (err) => {   // (FirestoreError) => ()
    central.error(`Failure listening to: ${docPath}`, err);
  });

  return [ref, unsub];
}

export {
  listenC,
  listenD
}
