/*
* src/tools/listenC.js
*
* Subscribe to a Firebase collection
*/
import { query, collection, onSnapshot } from 'firebase/firestore'

import { mapRef } from './mapRef'

/*
* Subscribe to a Firebase Firestore collection, with an optional 'QueryConstraint' (from a 'where' clause) to restrict
* the catch.
*
* The collection is shown as a Vue.js 3 'Ref'.
*/
function listenC(db, collectionPath, ...args ) {    // (Firestore, "{collectionName}", Array? of string|..., { context: string, conv?: obj => obj? }) => [Ref of Map of string -> string|bool|number|..., () => ()]

  const [qcArr, { context, conv }] =
    args.length == 2 ? [...args] :
    args.length == 1 ? [null, args[0]] : ( _ => { throw new Error(`Bad arguments: ${args}`) })();

  const fbColl = collection(db, collectionPath);
  const q = (!qcArr || qcArr.length === 0) ? query(fbColl) : query(fbColl, ...qcArr);

  const [ref, setN] = mapRef();

  const unsub = onSnapshot(q, (qss) => {
    const conv2 = conv || (x => x);

    // Collect all the changes together; pass them to the 'ref' at once.

    // tbd. how about removal of docs??

    const kvs = qss.docs().map( (dss) => {
      const id = dss.id;
      const data = conv2( dss.data() );

      return [id,data];
    }, (err) => {   // (FirestoreError) => ()
      central.error(`Failure listening to: ${context}`, err);
    });

    setN(kvs);
  });

  return [ref,unsub];
}

export {
  listenC
}
