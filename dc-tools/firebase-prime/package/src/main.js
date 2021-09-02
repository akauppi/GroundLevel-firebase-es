/*
* Main code
*/
import { initializeApp } from 'firebase-admin/app'    // for "modular API" (in alpha)

import { createUsers, wipeUsers } from './createUsers/index.js'
import { primeData } from './primeData/index.js'
import { wipe } from './primeData/wipe.js'

import { host, authPort, projectId } from './config.js'

async function main(docs, users) {

  // "The Firebase Admin SDK automatically connects to the Authentication emulator when the FIREBASE_AUTH_EMULATOR_HOST environment variable is set."
  //
  process.env["FIREBASE_AUTH_EMULATOR_HOST"] = `${host}:${authPort}`;

  // Initialize a Firebase client (only used for creation of users)
  //
  /*const appAdmin =*/ initializeApp({
    projectId
  });

  await Promise.all([
    wipe().then( _ => primeData(docs) ),
    wipeUsers().then( _ => createUsers(users) )
  ]);
}

export {
  main
}
