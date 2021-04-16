/*
* firebase-prime/createUsers.js
*
* Create the provided users to the Firebase emulator, using a Firebase client library (and '{ uid: "owner" }' trick).
*/
import { initializeAuth, signInWithCustomToken, updateProfile } from '@firebase/auth'
import { getApp } from '@firebase/app'

const useInitialize_WORK_AROUND = true;

// NOTE: Firebase 9.0.0-beta.1 'getAuth' seems broken, so we need to pass 'auth_WORK_AROUND' down here.
//
async function createUsers(auth /*WORK AROUND*/, users) {    // ({ <uid>: { displayName: string, photoURL: string } }) => Promise of ()

  // The thinking is.. we don't need to create the user, just sign in and add the profile data.

  for (const [uid,{ displayName, photoURL }] of Object.entries(users)) {
    console.debug("Creating...", { uid, displayName });

    const cred = await signInWithCustomToken( auth, JSON.stringify({ uid }) );

    console.debug("Signed in as: ", { cred });

    await updateProfile( cred.user, { displayName, photoURL });
  }
}

export {
  createUsers
}
