/*
* Consume Firestore
*/

import {doc, collection, onSnapshot,} from 'firebase/firestore'
import { db, auth } from '/@firebase'
import { assert } from '/@tools/assert'
import { docRef } from '/@tools/listen.ref'
import { watch } from 'vue'

const projectD = doc( collection(db, 'projects'), '0dyE0HDZvi1L5DpcXjv2');

function testConsumingDEBUG() {
  const currentUser = auth.currentUser;
  assert(currentUser);

  const [ref, _] = docRef(projectD);
  watch( ref, (data) => {
    console.debug("!!! Listened to:", { data });
  });

  /***
  /_*const unsub =*_/ onSnapshot( projectD, (ss) => {
    console.debug("!!! Listened to:", {
      id: ss.id,
      data: ss.data() }
    )

    // .id
    // .metadata
    // .data()    ; undefined | object
    // .exists()  ; Boolean

  }, (err) => {   // (FirestoreError) => ()
    central.error(`Failure listening to ${projectD.path}:`, err);
  });
  ***/


}

/*** disabled
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
***/

export {
  testConsumingDEBUG
}
