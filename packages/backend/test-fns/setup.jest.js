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
  await prime(projectId, docs);
}

export default setup;
