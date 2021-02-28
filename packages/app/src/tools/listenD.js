/*
* src/tools/listenD.js
*
* Subscribe to a Firebase document, providing its changes as a Vue.js 3 'Ref'.
*/
import { onSnapshot, collection, doc } from 'firebase/firestore'

import { ref as vueRef } from 'vue'

/*
* Present a certain Firestore document as Vue.js 3 'Ref'.
*
* The value is 'undefined' until the database connection has been established
*
* Design note:
*   Allowing the value to be initially 'undefined' works well for UI side code. Also returning a Promise was considered.
*
* opt: {
*   context: string   // describes the subscription; used in error messages
* }
*/
function listenD( db, path, opt) {   // ( FirebaseFirestore, "{collectionName}/{documentId}", { context: string } ) => [Ref of undefined | { ..firestore doc }, () => ()]
  const { context } = opt;

  const docRef = documentReference(db, path);

  const ref = vueRef();

  const unsub = onSnapshot( docRef, (doc) => {
    console.debug("!!! Listened to:", doc )

    ref.value = doc;
  }, (err) => {   // (FirestoreError) => ()
    central.error(`Failure listening to: ${context}`, err);
  });

  return [ref, unsub];
}

/*
* Create a Firebase 'DocumentReference' to listen to a document.
*/
function documentReference(db, path) {    // ( FirebaseFirestore, "{collectionName}/{documentId}" ) => DocumentReference

  const [_,a,b] = path.match(/(.+?)\/(.+)/);

  if (!a || !b) {
    throw new Error(`Bad Firebase document path: ${path}`);
  }

  // Firebase 8.x API
  //const dr = db.collection('projects').doc(projectId);    // DocumentReference

  // @exp API
  //const dr = doc( collection(db,'projects'), projectId );    // DocumentReference

  // could be (less tree-shaking but the idea that things go from general to more specific is valuable; makes the code
  //    easier to read); also needing to import *everything* is a chore...
  //
  //const dr = db.collection('projects').doc(projectId);    // DocumentReference
  //const dr = collection(db,'projects').doc(projectId);    // DocumentReference

  // The @exp API has a problem when it comes to 'doc' and 'collection': importing them adds to boilerplate and
  // makes the API less readable ('doc' and associated 'b' name are on different sides of the line. This is the
  // 0.900.15 API, anyhow, and we hide it from the app code. :)    #firebase-exp
  //
  // Opinion:
  //    The 'doc' could be a method of collection, instead (not tree-shakeable, but more understandable):
  //    >> return collection(db, a).doc(b);
  //
  return doc( collection(db, a), b);
}

export {
  listenD
}
