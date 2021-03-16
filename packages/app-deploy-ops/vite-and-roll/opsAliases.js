/*
* vite-and-roll/opsAliases.js
*
* Provide aliases that bind our implementations to imports in the app code ('@ops/central').
*
* e.g. { "@ops/central" -> "<path>/src/ops/central.js" }
*/
import {dirname} from 'path'
import {fileURLToPath} from 'url'

const myPath = dirname(fileURLToPath(import.meta.url));
const opsPath = myPath + "/../src/ops";

const opsAliases = {
  ["@ops/central"]: opsPath + "/central.js"
};

export {
  opsAliases
}
