/*
* back-end/test-rules/setup.jest.js
*
* Sets the (immutable) data for the Rules tests.
*/
import { docs } from './docs.js'

import { prime } from 'firebase-jest-testing/firestoreAdmin/setup'

const projectId = "demo-rules-test";   // must be lower case

const setup = async _ => {
  await prime(projectId, docs);
}

export default setup;
