/*
* firebase-prime/primeData.js
*
* Prime the Firestore emulator with data.
*/
import { getFirestore, writeBatch, doc } from '@firebase/firestore'
import { getAuth, signInWithCustomToken } from '@firebase/auth'

// NOTE: Firebase 9.0.0-beta.1 'getAuth' seems broken, so we need to pass 'auth_WORK_AROUND' down here.
//
async function primeData(auth /*WORK AROUND*/, data) {    // ({ <docKey>: object }) => Promise of ()

  // Claim admin rights (bypasses Security Rules)
  //
  const { user } = await signInWithCustomToken( auth, JSON.stringify( { uid: "owner" }));

  console.debug("!!! Signed in for admin as:", user);

  const db = getFirestore();

  const batch = writeBatch(db);

  for (const [docPath,value] of Object.entries(data)) {
    console.debug("!!!", { docPath });  // REMOVE
    batch.set( doc(db, docPath), value );
  }
  await batch.commit();
}

export {
  primeData
}
