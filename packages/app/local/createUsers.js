/*
* local/createUsers.js
*
* References:
*   - "Connect your app to the Authentication Emulator"
*     -> https://firebase.google.com/docs/emulator-suite/connect_auth#node.js-admin-sdk
*/
import { users } from './users.js'

import admin from 'firebase-admin'

// Sniff the port
import firebaseJson from '../firebase.json'
const AUTH_HOST = `localhost:${firebaseJson.emulators.auth.port}`;

// "The Firebase Admin SDK [>= 9.3.0] for Node.js automatically connects to the Authentication emulator when the
// FIREBASE_AUTH_EMULATOR_HOST environment variable is set."
//
//    -> https://firebase.google.com/docs/emulator-suite/connect_auth#admin_sdks
//
if (! process.env["FIREBASE_AUTH_EMULATOR_HOST"]) {

  // Note: It's weird how each Firebase sub-project has its own way of needing to set emulation on.. :(
  //    Ideally, none of them should need any of this...
  //
  process.env["FIREBASE_AUTH_EMULATOR_HOST"] = AUTH_HOST;
}

async function createUsers() {

  for (const [uid,{ displayName, photoURL }] of Object.entries(users)) {
    // since >= 9.4.0, this works
    await admin.auth().createUser({ uid, displayName, photoURL });
  }
}

export {
  createUsers
}
