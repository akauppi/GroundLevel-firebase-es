/*
* test-fns/setup.jest.js
*
* Sets the data for functions tests.
*/
import { docs } from './docs.js'

import { prime } from 'firebase-jest-testing/firestoreAdmin/setup'

const projectId = "demo-2";       // must be lower case
                                  // ..and match with the '--project=...' in 'package.json'
                                  // ..so that you can see Firestore contents in the UI (:4000)
const setup = async _ => {

  await prime(projectId, docs).catch( err => {

    // Note: This was attended to also in the library side. May not be needed, any more.
    //
    // Jest itself gives a too terse report ("reason: fetch failed"), so let's get some detail.
    //
    console.error("Priming failed:", { err });
      /*
      * <<
      *   cause: Error: connect ECONNREFUSED ::1:6767
      *   at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1237:16) {
      *     errno: -61,
      *     code: 'ECONNREFUSED',
      *     syscall: 'connect',
      *     address: '::1',
      *     port: 6767
      *   }
      * <<
      */

    throw err;
  })
}

export default setup;
