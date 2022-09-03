/*
* src/central/logs.js
*
* Application specific logs.
*/
import { createLog } from './common'

const logHey_INFO = createLog("hey!", "info");

const LOCAL = import.meta.env.MODE === "dev_local";
if (LOCAL) {    // support for testability (tbd. is there a better way to reveal something to Cypress scripts?)
  window.TEST_logDummy = createLog("test-dummy", "info");
}

export {
  logHey_INFO
}
