/*
* firebase-prime/createUsers/index.js
*
* Create the provided users to the Firebase emulator.
*
* Node.js Admin SDK (alpha) implementation.
*/
import { getAuth } from 'firebase-admin/auth'

/*
* Note:
*   Trying to run this twice on the same emulator instance (and project) causes an error. This should not happen
*   in the use case the code was originally made for. If it does, let's change the code to wipe existing users out
*   before writing new ones (or call 'auth.createUser').
*/
async function createUsers(users) {    // ({ <uid>: { displayName, string, photoURL: string, customClaims?: { ... } }) => Promise of ()
  const auth = getAuth();

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
    fail( `Importing users failed: ${ errors.map(x => x.error.message).join(', ') }`)
  }
}

/*
* Wipe existing users.
*
* Needed because with Docker Compose, one cannot know if the earlier (stateful) emulator container is taken into use,
* or a new one created.
*/
async function wipeUsers() {    // () => Promise of ()
  const auth = getAuth();

  const tmp = await auth.listUsers();   // Array of ListUserResult; ListUserResult: { users: UserRecord }; UserRecord: { ..., uid: string }
  const uids = tmp.users.map( x => x.uid );

  if (uids.length > 0) {
    const { errors } = await auth.deleteUsers(uids);   // errors: Array of FirebaseArrayIndexError
    if (errors.length > 0) {
      fail( `Wiping users failed: ${ errors.map(x => x.error.message).join(', ') }`)
    }
  }
}

function fail(msg) { throw new Error(msg) }

export {
  createUsers,
  wipeUsers
}
