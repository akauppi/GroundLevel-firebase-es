/*
* test/prime-docs.js
*
* Write the data in 'docs.js' to the running emulator's Firestore instance.
*/
import { docs } from './docs.js'
import { prime } from 'firebase-jest-testing/firestore'

//console.info("Priming...");

(async _ => {
  await prime(docs);
  console.info("Primed :)");
})();
