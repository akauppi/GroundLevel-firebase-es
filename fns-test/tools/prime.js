/*
* fns-test/prime.cjs
*
* Write data to the emulated Firestore.
*/
//import { db } from './session'
const db = require('./session.cjs');

/*
* Prime a database with data
*/
async function prime(data) {    // ({ <docPath>: { <field>: <value> } }) => Promise of ()
  const batch = db.batch();

  for (const [docPath,value] of Object.entries(data)) {
    batch.set( db.doc(docPath), value );
  }
  await batch.commit();

  db.app.delete();
}

//export { prime }
module.exports = prime
