/*
* Main code
*/
import { initializeApp } from 'firebase-admin/app'    // for "modular API" (in alpha)
import { getAuth } from 'firebase-admin/auth'

import { createUsers } from './createUsers.js'
import { primeData } from './primeData/index.js'
import { wipe } from './primeData/wipe.js'
import { host, authPort, projectId } from './config.js'

async function main(docs, users) {

  // "The Firebase Admin SDK automatically connects to the Authentication emulator when the FIREBASE_AUTH_EMULATOR_HOST environment variable is set."
  //
  process.env["FIREBASE_AUTH_EMULATOR_HOST"] = `${host}:${authPort}`;

  // Initialize a Firebase client (only used for creation of users)
  //
  const auth = (_ => {
    /*const appAdmin =*/ initializeApp({
      projectId
    });
    return getAuth();
  })();

  await Promise.all([
    wipe().then( _ => primeData(docs) ),
    createUsers(auth, users)
  ]);
}

export {
  main
}
