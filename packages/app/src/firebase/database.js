/*
* src/firebase/database.js
*
* Provide Realtime Database handles to application level.
*
* NOTE:
*   Realtime Database is only available (Jun 2022) in selected regions (us-central1, europe-west1, asia-southeast1).
*   If your Firebase project's region differs from these, we adjust by telling the client where the database is to be
*   found.
*/
import { getDatabase, ref } from '@firebase/database'

const dbRegion = "europe-west1";    // TBD. tbd. Get from a configuration
const projectId = "groundlevel-160221"    // tbd. where from???

// Note: If the deployed region matches the dbRegion, there's no need for anything.
// tbd. Could we pick up the URL from the default Database handle?

const db = getDatabase(undefined, `https://${ projectId }-default-rtdb.${ dbRegion }.firebasedatabase.app/`);

function dbRefGen(path) {
  return ref(db, path);
}

export {
  dbRefGen
}
