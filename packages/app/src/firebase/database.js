/*
* src/firebase/database.js
*
* Provide Realtime Database handles to application level.
*/
import { getDatabase, ref } from '@firebase/database'

const db = getDatabase();

function dbRefGen(path) {
  return ref(db, path);
}

export {
  dbRefGen
}
