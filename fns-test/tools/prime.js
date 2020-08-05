/*
* fns-test/prime.js
*
* Write data to the emulated Firestore.
*/
import { db } from './session.js'
//REMOVE: const db = require('./session.cjs');

/*
* Prime a database with data
*/
async function prime(data) {    // ({ <docPath>: { <field>: <value> } }) => Promise of ()
  const batch = db.batch();

  for (const [docPath,value] of Object.entries(data)) {
    batch.set( db.doc(docPath), value );
  }
  await batch.commit();

  const ignore = db.app.delete();   // tail free-roaming
}

export { prime }
//REMOVE: module.exports = prime