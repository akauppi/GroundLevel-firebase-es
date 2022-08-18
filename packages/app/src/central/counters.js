/*
* src/central/counters.js
*
* Application specific counter metrics.
*/
import { createCounter } from './common'

const countLogins = createCounter("login");

export {
  countLogins
}
