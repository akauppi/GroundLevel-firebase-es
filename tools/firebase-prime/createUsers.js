/*
* firebase-prime/createUsers.js
*
* Create the provided users to the Firebase emulator.
*/
import { signInWithCustomToken, updateProfile, getAuth } from '@firebase/auth'

async function createUsers(auth, users) {    // (FirebaseAuth, { <uid>: { displayName: string, photoURL: string } }) => Promise of ()

  // The thinking is.. we don't need to create the user, just sign in and add the profile data.

  for (const [uid,{ displayName, photoURL }] of Object.entries(users)) {
    console.debug("Creating...", { uid, displayName });

    const cred = await signInWithCustomToken( auth, JSON.stringify({ uid }) );

    await updateProfile( cred.user, { displayName, photoURL });
  }
}

export {
  createUsers
}
