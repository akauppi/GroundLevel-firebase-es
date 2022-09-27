/*
* gym/index.js
*
* Usage:
*   <<
*     # while app backend is running..
*     $ node index.js
*   <<
*/
import { initializeApp } from 'firebase-admin/app'
import { getDatabase, ServerValue } from 'firebase-admin/database'

function fail(msg) { throw new Error(msg) }   // use at loading; not within a callable

import mod from '../firebase.app.js'
const databasePort = mod?.emulators?.database?.port || fail("Cannot find 'emulator.database.port'");

const PROJECT_ID = "demo-main";    // the way it's launched
const DATABASE_URL = `http://localhost:${databasePort}?ns=${PROJECT_ID}`;   // WORKS!!

// UNFINISHED. For pushing online, you'd need proper authentication as well. (but it seems we reach it :))
//
//const PROJECT_ID = "groundlevel-sep22";
//const DATABASE_URL = `https://${ PROJECT_ID }.firebaseio.com`;    // online

console.info("Database URL:", DATABASE_URL);

const app= initializeApp({
  databaseURL: DATABASE_URL
});

const db = getDatabase(app);

/*
* Increment a counter in emulated Realtime Database
*/
async function counterGym({ id, diff }) {    // => Promise of ()
  const at = Date.now();

  const refRaw = db.ref("incoming/incs");

  await refRaw.push({
    id, diff, clientTimestamp: at
  });

  const refAggregate = db.ref(`counts/${id}`);    // Note: likely not sharing the doc with other counters would cause less collisions

  await refAggregate.set( { "=": ServerValue.increment(diff) })    // Note: Tags can be added by '{k}={v}'
}

/**function logGym({ id, level, msg, args }) {   // => Promise of ()
  const at = Date.now();
  const uid = "jim";

  fail("not implemented");
}*/

//--- Main :)

await counterGym({ id: "gym", diff: 0.01 });

process.exit(0);
  // must explicitly exit; something keeps it running, otherwise
