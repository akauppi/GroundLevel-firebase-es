/*
* src/central/counters.js
*
* Application specific counter metrics.
*/
import {createInc} from './common'

const countLogins = createInc("login");

export {
  countLogins
}
