/*
* test-fns/setup.jest.js
*
* Sets the data for functions tests.
*/
import { docs } from './docs.js'

import { prime } from 'firebase-jest-testing/firestoreAdmin/setup'

const projectId = "fns-test";     // must be lower case
                                  // ..and match with the '--project=...' in 'package.json'
const setup = async _ => {
  await prime(projectId, docs);

  console.debug("Docs primed for test-fns.");
}

export default setup;
