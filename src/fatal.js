/*
* src/fatal.js
*
* Report 'Error's (includes failed asserts) to a cloud service - if configured.
*/

import { ops } from './config'
const { error } = ops;

const fatal = (_ => {   // => (Error) => ()

  if (LOCAL) {  // no sending (could log locally, or to host terminal)

  } else if (!error.type) {

  } else if (error.type === 'airbreak') {

    // tbd.
    console.error("!!! Make me fast!");

    return err => {};

  } else {
    // Note: No calling 'fatal' though our config is bad. Hmm...
    alert(`No-one to call to:\n\nUnexpected 'ops.error' configuration: ${ops.error.type}`);
    return _ => {};
  }

})();

export {
  fatal
}
