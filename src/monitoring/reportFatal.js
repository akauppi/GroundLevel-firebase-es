/*
* src/monitoring/reportFatal.js
*
* Report a fatal, unexpected incident to central monitoring.
*
* Reference:
*   - Write and view logs (Firebase functions docs)
*     -> https://firebase.google.com/docs/functions/writing-and-viewing-logs
*/
import {fns} from '../firebase/fns'

const fnFatal = fns.httpsCallable('fatal_v210720');

/*
* To be called when something totally unexpected happens.
*
* Note: ONLY use this for fatal incidents, in runtime. This would ensure that we can
*
* Note: Intentionally not an async function.
*/
function reportFatal(msg,ex) {   // (string, exception) => ()

  console.fatal("Unexpected error: "+msg, ex);

  const prom = fnFatal(msg, ex);

  // tbd. show the '#fatal' UI item
  const el = document.querySelector("#fatal");
  if (el) {
    el.innerText = ex.toString();
    el.show();
  } else {
    alert("Something unexpected happened! The authors have been notified. See console log for details.");
  }

  // See that the promise fulfills. If not, give another alert
  //
  prom.catch(reason => {
    alert("Problem reaching the back end:", reason);
  });
}

export {
  reportFatal
}
