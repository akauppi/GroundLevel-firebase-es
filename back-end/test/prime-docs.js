/*
* fns-test/prime-docs.js
*
* Write the data in 'docs.js' to the running emulator's Firestore instance.
*/
import { docs } from './docs.js'
import { prime } from '@akauppi/firebase-jest-testing/firestore'

//console.info("Priming...");
await prime(docs);
console.info("Primed :)");
