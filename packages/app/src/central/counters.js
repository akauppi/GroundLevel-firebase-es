/*
* src/central/counters.js
*
* Application specific counter metrics.
*/
import {createCounter} from './common'

const countLogins = createCounter("login");

const LOCAL = import.meta.env.MODE === "dev_local";
if (LOCAL) {    // support for testability (tbd. is there a better way to reveal something to Cypress scripts?)
  window.TEST_countDummy = createCounter("test-dummy");
}

export {
  countLogins
}
