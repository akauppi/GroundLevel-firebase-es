#!/usr/bin/env node

/*
* Command line entry point.
*/
import program from 'commander'

import { initializeApp, deleteApp } from '@firebase/app'
import { getAuth, initializeAuth, useAuthEmulator } from '@firebase/auth'
import { getFirestore, useFirestoreEmulator } from '@firebase/firestore'

import { createUsers } from './createUsers.js'
import { primeData } from './primeData/index.js'
import { wipe } from './primeData/wipe.js'
import { firestorePort, authPort } from './config.js'

/* Firebase 9.0.0.beta-{1..3} 'getAuth' seems broken. Gives us this ('initializeAuth' works):    #unreported
*
*  <<
*   [init] Creating users...
[init] /Users/asko/Git/GroundLevel-firebase-es/node_modules/@firebase/app/dist/index.cjs.js:268
[init]     return app.container.getProvider(name);
[init]                ^
[init]
[init] TypeError: Cannot read property 'container' of undefined
[init]     at Object._getProvider (/Users/asko/Git/GroundLevel-firebase-es/node_modules/@firebase/app/dist/index.cjs.js:268:16)
[init]     at getAuth (/Users/asko/Git/GroundLevel-firebase-es/node_modules/@firebase/auth/dist/node/index.js:36:24)
[init]     at createUsers (file:///Users/asko/Git/GroundLevel-firebase-es/tools/firebase-prime/createUsers.js:9:16)
[init]     at Command.main (file:///Users/asko/Git/GroundLevel-firebase-es/tools/firebase-prime/index.js:74:11)
*  <<
*/
const getAuth_WORK_AROUND = true;

program
  .arguments('<docs-file> <users-file>')
  .option('--project <project-id>', 'Firebase project id')
  .action(main)
  .parse(process.argv);

async function main(docsFn, usersFn) {
  const projectId = program.opts().project || fail('Missing \'--project=...\'');

  // Little trickery to import relative to current directory.
  //
  const { docs } = await import(`${ process.cwd() }/${docsFn}`);
  const { users } = await import(`${ process.cwd() }/${usersFn}`);

  if (!docs) fail(`Missing 'docs' export in: ${docsFn}`);
  if (!users) fail( `Missing 'users' export in: ${usersFn}`);

  // Initialize a Firebase client
  //
  const fah = initializeApp({
    projectId,
    apiKey: "none"
  });

  const auth = !getAuth_WORK_AROUND ? getAuth()   // should work, right?
    : initializeAuth(fah);   // use this; 'getAuth()' gives an error ('firebase' 9.0.0-beta.[1..2])

  const db = getFirestore();

  // Handle the emulation-awareness-lifting here
  //
  useAuthEmulator(auth, `http://localhost:${authPort}`);
  useFirestoreEmulator(db, 'localhost', firestorePort);

  await Promise.all([
    wipe(projectId).then( _ => primeData(projectId, docs) ),
    createUsers(auth, users)
  ]);

  await deleteApp(fah);
}

function fail(msg) {
  console.error(msg);
  process.exit(2);
}
