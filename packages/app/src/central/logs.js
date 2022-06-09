/*
* src/central/logs.js
*
* Logs and counters.
*
* Client side support for sending logs / counter increments to Cloud Functions.
*/
import { queue } from './ship.js'

function createLog(id, level = "info") {   // (string, "info"|"warn"|"error"|"fatal") => (msg, ...) => ()

  return (msg, ...args) => {
    queue({ "":"log", id, level, msg, args });

    console.debug("Central log:", { id, msg, level, args })
  }
}

const logHey = createLog("hey!");

export {
  logHey
}
