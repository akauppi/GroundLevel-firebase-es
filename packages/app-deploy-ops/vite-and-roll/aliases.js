/*
* vite-and-roll/aliases.js
*
* Provide aliases that bind our implementations to imports in the app code ('@ops/central'),
* plus some for our own use.
*
* e.g. { "@ops/central" -> "<path>/src/ops/central.js" }
*/
import {dirname} from 'path'
import {fileURLToPath} from 'url'
import {readdirSync, existsSync} from 'fs'
import { resolve as pathResolve } from 'path'

const env = process.env["ENV"] || "staging";

const myPath = dirname(fileURLToPath(import.meta.url));
const srcPath = myPath + "/../src";
const opsPath = srcPath + "/ops";
const adaptersPath = myPath + "/../adapters";
const envPath = myPath + `/../../../firebase.${env}.js`;

if (!existsSync(envPath)) {
  fail(`No '${envPath}' found. Please create one or change the staging name by 'ENV=...'.`);
}

function fail(msg) { throw new Error(msg) }

const opsAliases = (() => {
  const pairs = readdirSync(opsPath).map( s => {    // 'central.js', 'perf.js'
    const [_,c1] = s.match(/(.+)\.js$/) || [];    // pick
    if (c1) {
      const tmp = pathResolve(opsPath, s);
      return [`@ops/${c1}`, tmp];
    } else {
      throw new Error("What's up? "+ c1);
    }
  }).filter( x => x !== undefined ); // Array of ['@ops/...', '...path...']

  return Object.fromEntries(pairs);
})();

const aliases = { ...opsAliases,
  ["/@adapters"]: adaptersPath,
  ["/@env"]: envPath,

  //["/@src"]: srcPath
};

export {
  aliases
}
