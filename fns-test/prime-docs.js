/*
* fns-test/prime-docs.js
*
* Write the data in 'docs.js' to the running emulator's Firestore instance.
*/
import { docs } from './docs.js'
import { prime } from './tools/prime.js'

// note: we don't mind if the return is earlier than data actually has been written, but once top-level await is
//    available (Node 14.3 has it with '--harmony-top-level-await'), use it here.
//
(async () => {
  //console.info("Priming...");
  await prime(docs);
  console.info("Primed :)");
})();

