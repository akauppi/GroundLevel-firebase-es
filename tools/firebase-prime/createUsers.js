/*
* firebase-prime/createUsers.js
*
* Create the provided users to the Firebase emulator.
*/
import { strict as assert } from 'assert'
import { signInWithCustomToken, updateProfile } from '@firebase/auth'

// tbd. Ideally, use 'getAuth' instead of the 'auth' parameter

async function createUsers(auth, users) {    // (FirebaseAuth, { <uid>: { displayName: string, photoURL: string } }) => Promise of ()

  // We don't need to create the user, just sign in and add the profile data.
  // Note: Similar code in 'packages/app/cypress/commands/index.js'

  for (const [uid,{ displayName, photoURL }] of Object.entries(users)) {
    console.debug("Creating...", { uid, displayName });

    const { user: /*as*/ currentUser } = await signInWithCustomToken( auth, JSON.stringify({ uid }) );
    assert(currentUser.uid === uid);

    await updateProfile( currentUser, { displayName, photoURL });
  }
}

export {
  createUsers
}
