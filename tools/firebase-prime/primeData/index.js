/*
* primeData/index.js
*
* Prime the Firestore emulator with data.
*
* References:
*   - Firestore > REST > Write
*     -> https://firebase.google.com/docs/firestore/reference/rest/v1/Write
*/
import { commit_v1, mapValue } from './commit-set.js'

async function primeData(projectId, data) {    // (string, { <docKey>: object }) => Promise of ()

  // Note: Though the field says 'update' it really is a set (without 'updateMask')
  //
  const writes = Object.entries(data).map( ([docPath, o]) => ({
    update: {
      name: `projects/${projectId}/databases/(default)/documents/${ docPath.startsWith('/') ? docPath.slice(1) : docPath }`,
      ...mapValue(o)   // 'Document' is just like an extended 'MapValue'
    }
  }));

  await commit_v1(projectId, "owner", writes);
}

export {
  primeData
}
