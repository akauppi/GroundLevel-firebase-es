/*
* src/central/counters.js
*
* Increment central counters.
*/
import { createCounter } from './support'

const countLogins = createCounter("login");

export {
  countLogins
}
