#!/usr/bin/env node

/*
* test-fns/ack-await.js
*
* Listens to the "warmed up" acks from '../functions-warm-up/index.js'.
*
* Acks are sent through Firestore (file system could be another mechanism, but would need cleanup, unlike Firestore),
* but a second project id to avoid being cleaned up by the Jest setup.
*/
import { readFileSync } from 'fs'
import { performance } from 'perf_hooks'

function fail(msg) { throw new Error(msg) }

// These need to match with '../functions-warm-up/index.js'
//
const projectId = "warmed-up"
const docPath = "warmed-up/_"   // { "1": true, "2": true }

const FIRESTORE_HOST = (_ => {
  const raw = readFileSync('./firebase.json');
  const json = JSON.parse(raw);

  const port = json.emulators?.firestore?.port ||
    fail( "Did not find 'emulators.firestore.port' in 'firebase.json'" );

  return `localhost:${port}`;
})();

// Need to use actual Admin SDK because 'firebase-jest-testing' would only provide access to the project that priming
// has named.
//
import { initializeApp } from 'firebase-admin/app'    // "modular API" (alpha)

/*
* Adapted from 'firebase-jest-testing'
*/
const dbAdminAlien = (_ => {
  const adminApp = initializeApp({
    projectId
  }, `unlimited-${ Date.now() }`);   // unique name keeps away from other "apps" (configurations, really); btw. would be nice if Firebase APIs had nameless "apps" easier.

  const db = adminApp.firestore();
  db.settings({
    host: FIRESTORE_HOST,
    ssl: false
  });

  process.on( 'exit', async () => {   // clean up (might not be needed)
    await adminApp.delete();
  });

  return db;
})();

async function waitForAck(key) {    // (string) => Promise of ()

  return new Promise( (resolve) => {

    const unsub = dbAdminAlien.doc(docPath).onSnapshot( ss => {
      if (!ss.exists) return;
      const o = ss.data();

      if (o[key]) {
        resolve(o);
        /*await*/ unsub();
      }
    });
  });
}

const t0 = performance.now();

// Top-level await, to wait until both logging and userinfo are ready for tests.
//
await Promise.all([
  waitForAck("1").then( _ => {
    console.log(`Got ACK that USERINFO-listening is ready (waited ${ Math.round(performance.now() - t0) }ms)`);
  }),
  waitForAck("2").then( _ => {
    console.log(`Got ACK that LOGGING is ready (waited ${ Math.round(performance.now() - t0) }ms)`);
  })
])
