/*
* functions/userInfoShadow.js
*
* Note: This module is reusing the Firestore handle from Cloud Functions. This is fine (and simplifies initialization).
*     If you, however, want to manually control the version of that library, call 'initializeApp', 'getFirestore'.
*     This means you need to add '@google-cloud/firestore' to the dependencies.
*/
import { regionalFunctions_v1 } from './common.js'
  // 'v2' doesn't have '.firestore', yet (Oct, Jul 2022)

// UserInfo shadowing
//
// Track changes to global 'userInfo' table, and update projects where the changed user is participating with their
// renewed user info.
//
const userInfoShadow_2 = regionalFunctions_v1.firestore
  .document('/userInfo/{uid}')
  .onWrite( async (change, context) => {
    const [before,after] = [change.before, change.after];   // [QueryDocumentSnapshot, QueryDocumentSnapshot]
    const uid = change.after.id;

    const db = change.before.ref.firestore;   // borrow a Firestore handle we can use

    const newValue = after.data();      // { ... } | undefined
    console.debug(`Global userInfo/${uid} change detected: `, newValue);

    // Removal of userInfo is not propagated. Only tests do it, as 'beforeAll'.
    //
    if (newValue !== undefined) {

      // Find the projects where the person is a member.
      //
      // tbd. Once we're operational, consider whether having 'userInfo' within the project document is considerably
      //    cheaper. #rework #monitoring #billing
      //
      const qss = await db.collection('projects')
        .where('members', 'array-contains', uid)
        .select()   // don't ship the fields, just matching ref
        .get();

      if (qss.size === 0) {
        console.debug(`User '${uid}' not found in any of the projects.`);

      } else {
        const arr = qss.docs;   // Array of QueryDocumentSnapshot
        const proms = arr.map( qdss => {

          return qdss.ref.collection("userInfo").doc(uid).set(newValue);    // Promise of WriteResult
        });
        await Promise.all(proms);
      }
    }
  });

export {
  userInfoShadow_2
}
