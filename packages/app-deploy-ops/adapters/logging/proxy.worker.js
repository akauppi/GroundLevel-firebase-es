/*
* adapters/logging/proxy.worker.js
*
* Web Worker for 'proxy.js'.
*
* Batches the log entries, handles things like batch size limit, batch age limit, offline awareness.
*/

const OPTIONS = {
  batchSizeMax: 50,       // collect at most this many
  batchAgeSecMax: 5       // keep at most this long
};

import { httpsCallable } from '@firebase/functions'
import { fnsRegional } from '/@src/fns'   // handle to Firebase Cloud Functions; with region

//const logs_v1 = httpsCallable(fnsRegional,"logs_v1");

console.log("Worker loaded");

/* {
  msg,
  payLoad,
  createdMs: t,
}*/

onmessage = function(e) {
  console.log("Worker received:", e);
}
