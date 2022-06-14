/*
* beam.js
*
* Adapt the callable interface with the tests.
*   - create batches of just one
*/
import { httpsCallable } from 'firebase-jest-testing/firebaseClientLike'

import { expect } from "@jest/globals"

const fn = httpsCallable("landingZone_v0");   // (Array of { "": "log"|"inc", ... }) => Promise of { data: any?, error: object? }

/*
* Wrapper around the Callable. Check that no 'HttpError' errors.
*/
async function fnBeam(entries) {    // (Array of { "":"log"|"inc", ... }) => Promise of ()

  await fn(entries).then( ({ data, error }) => {
    expect(error).toBeUndefined();
    expect(data).toBeUndefined();   // change if the calls actually return something
  });
}

export {
  fnBeam
}
