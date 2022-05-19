/*
* primeData/wipe.js
*
* Clear a whole project's Firestore database.
*
* This is needed to clear away possible existing cruft from an earlier run.
*/
import { strict as assert } from 'assert'

import { firestorePort, host, projectId } from '../config.js'

/*
* Based on 'rules-unit-testing' sources; re-implemented using 'fetch' API.
*/
async function wipe() {   // () => Promise of ()
  assert(projectId);

  const uri = `http://${host}:${firestorePort}/emulator/v1/projects/${projectId}/databases/(default)/documents`;
  const method = 'DELETE';
  const body = JSON.stringify({
    database: `projects/${projectId}/databases/(default)`
  });

  const res = await fetch(uri, {method, body});
  //
  // No reason to catch the error. If those arise, they are of the form:
  //    FetchError: request to http://localhost:6767/emulator/v1/projects/rules-test/databases/(default)/documents failed, reason: connect ECONNREFUSED 127.0.0.1:6767

  const status = res.status;

  if (status !== 200) {
    const body = await res.text();
    const msg = `Unexpected response from ${method} ${uri} (${status}): ${body}`;
    throw new Error(msg);
  }
}

export {
  wipe
}
