/*
* src/data/common.js
*
* Provide access to the app's Firestore instance.
*/
import { firestore as db } from '/@/firebase'
import { doc, collection, query, where } from "firebase/firestore"

/*
* <<
*   q(`projects/${projectId}/userInfo`, [FieldPath.documentId, '!=', uid])
* <<
*/
function dbQ(collPath, whereArr) {    // (string, Array of string) => Query
  const coll = collection(db, collPath);
  return query( coll, where(...whereArr) );
}

/*
* <<
*   q(`projects/${projectId}/userInfo`, [FieldPath.documentId, '!=', uid])
* <<
*/
function dbC(collPath) {    // (string) => CollectionReference
  return collection(db, collPath);
}

/*
* <<
*   q(`projects/${projectId}/userInfo`, [FieldPath.documentId, '!=', uid])
* <<
*/
function dbD(docPath) {    // (string) => DocumentReference
  const [_,a,b] = docPath.match(/^(.+)\/(.+?)$/);   // split to collection and doc parts

  console.debug(`Parsing path '${docPath}':`, { collection: a, doc: b } );

  return doc( collection(db,a), b );
}

export {
  //dbC,
  dbD,
  //dbQ
}
