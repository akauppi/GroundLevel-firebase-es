#!/usr/bin/env node

/*
* Command line entry point.
*/
import program from 'commander'
import { readFileSync } from 'fs'

import { initializeApp, deleteApp } from '@firebase/app'
import { getAuth, initializeAuth, useAuthEmulator } from '@firebase/auth'
import { getFirestore, useFirestoreEmulator } from '@firebase/firestore'

import { createUsers } from "./createUsers.js"
//import { primeData } from "./primeData.js"

const projectId = process.env["GCLOUD_PROJECT"];
if (!projectId) {
  throw new Error("No 'GCLOUD_PROJECT' env.var. set.");
}

const firebaseJson = "./firebase.json";

/* Firebase 9.0.0.beta-1 'getAuth' seems broken. Gives us this ('initializeAuth' works):    #unreported
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
  .arguments('<docs-and-users-file>')
  //.option('--project <project-id>', 'Firebase project id')
  .action(main)
  .parse(process.argv);

async function main(fn) {
  //console.log("!!!", { projectId, fn });

  // Little trickery to import relative to current directory.
  //
  const { docs, users } = await import(`${ process.cwd() }/${fn}`);

  if (!docs) fail(`Missing 'docs' export in: ${fn}`);
  if (!users) fail( `Missing 'users' export in: ${fn}`);

  // Get the Firebase emulator ports from Firebase configuration file.
  //
  const [firestorePort, authPort] = (_ => {
    const raw = readFileSync(firebaseJson);
    const conf = JSON.parse(raw);

    const a = conf?.emulators?.firestore?.port || fail(`No 'emulators.firestore.port' in ${firebaseJson}`);
    const b = conf?.emulators?.auth?.port || fail(`No 'emulators.auth.port' in ${firebaseJson}`);
    return [a, b];
  })();

  // Initialize a Firebase client
  //
  const fah = initializeApp({
    projectId,
    apiKey: "none"
  });

  const auth = !getAuth_WORK_AROUND ? getAuth()   // should work, right?
    : initializeAuth(fah);   // use this; 'getAuth()' gives an error ('firebase' 9.0.0-beta.1)

  const db = getFirestore();

  // Handle the emulation-awareness-lifting here
  //
  useAuthEmulator(auth, `http://localhost:${authPort}`);
  useFirestoreEmulator(db, 'localhost', firestorePort);

  if (true) {   // firebase-admin version (works)
    const admin = await import('firebase-admin').then( mod => mod.default );

    const adminApp = admin.initializeApp({
      projectId
    });

    adminApp.firestore().settings({   // old way (but works)
      host: `localhost:${firestorePort}`,
      ssl: false
    });

    const fsAdmin = adminApp.firestore();
    const batch = fsAdmin.batch();

    for (const [docPath,value] of Object.entries(docs)) {
      batch.set( fsAdmin.doc(docPath), value );
    }
    await batch.commit();

    await adminApp.delete();   // clean the app; data remains
  }

  /*if (true) {   // client version (WIP)
    console.debug("Priming data...");
    await primeData(auth, docs);
  }*/

  if (true) {
    console.info("Creating users...");
    await createUsers(auth, users);
  }

  await deleteApp(fah);
}

function fail(msg) {
  console.error(msg);
  process.exit(2);
}
