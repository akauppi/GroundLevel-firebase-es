/*
* src/central/counters.js
*
* Increment central counters.
*/
import { queue } from './ship.js'

function crCounter(name) {  // (string) => (diff = 1.0, { tag: v }?) => ()

  return (diff = 1.0, tags = {}) => {
    queue({ "":"inc", name, diff, tags });

    console.debug("Central inc:", { name, diff, tags });
  }
}

const countLogins = crCounter("login");

export {
  countLogins
}
