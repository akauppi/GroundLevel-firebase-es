/*
* firebase-prime/createUsers/index.js
*
* Create the provided users to the Firebase emulator.
*
* Node.js Admin SDK (alpha) implementation.
*/

/*
* Note:
*   Trying to run this twice on the same emulator instance (and project) causes an error. This should not happen
*   in the use case the code was originally made for. If it does, let's change the code to wipe existing users out
*   before writing new ones (or call 'auth.createUser').
*/
async function createUsers(auth, users) {    // (Auth, { <uid>: { displayName, string, photoURL: string, customClaims?: { ... } }) => Promise of ()

  // Convert into Admin SDK 'UserImportRecord's: 'uid' becomes part of the payload.
  //
  const recs = Object.entries(users).map( ([uid,o]) => ({ ...o, uid }) );

  const {
    //failureCount,   // int
    //successCount,   // int
    errors          // Array of { index: int, error: FirebaseError }
  } = await auth.importUsers(recs);

  // 'auth.importUsers' doesn't reject the promise, if some imports fail. This is likely a good design decision, but we
  // either want full success, or nothing.
  //
  // Note / criticism:
  //    The function could simply return a Promise of Array of errors. 'failureCount' always matches its size. 'Successcount'
  //    is the difference between given array and return 'errors'.

  if (errors.length > 0) {
    throw new Error( `Importing users failed: ${ errors.map(x => x.error.message).join(', ') }`)
  }
}

export {
  createUsers
}
