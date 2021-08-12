/*
* roll/injectPairs.js
*
* Provide the key/value pairs for injection for the main build.
*
* Note: We just collect the data here; how it's injected is up to the build.
*/
import { readdirSync } from 'fs'

import { dirname } from 'path'
import { fileURLToPath } from 'url'

const myPath = dirname(fileURLToPath(import.meta.url));

// Hashes for loading the proxy/proxies.
//
const proxyPairs = (_ => {
  const workerFiles = readdirSync(myPath + '/out/worker/');    // Array of string

  //console.log("!!!", workerFiles);    // [ 'worker-924359a7.js', 'worker-924359a7.js.map' ]

  // Get the hash of a matching worker output file. If there are multiple candidates, throw up.
  //
  function hash(postfix) {   // (string) => string
    const re = /^worker-([0-9a-f]+)(\..+)$/;

    const hashes = workerFiles.map(x => {
      const [_, c1, c2] = re.exec(x) || [];
      if (c2 === postfix) {
        return c1;  // the hash
      } else {
        return null;
      }
    }).filter(x => !!x);

    if (hashes[1]) fail(`More than one match for 'worker-*${postfix}': ${hashes}`);
    if (!hashes[0]) fail(`No match for 'worker-*${postfix}`);

    return hashes[0];
  }

  return [
    ['PROXY_WORKER_HASH', hash('.js')],
    //['PROXY_WORKER_HASH_IIFE', hash('.iife.js')]   // IIFE
  ];
})();

// Values from environment variables:
//  - RAYGUN_API_KEY
//
// These are expected to be provided by the CI script.
//
const envPairs = (_ => {
  const a = ['RAYGUN_API_KEY'];

  const pairs = a.map( k => [k, process.env[k]] );

  const missing = pairs.flatMap(([k,v]) => !v ? [k] : []);
  if (missing.length > 0) {
    fail(`Not having values for env.var(s): ${ missing.join(',') }`)
  }

  return pairs;
})();   // Array of [string, string]

function fail(msg) { throw new Error(msg) }

export {
  proxyPairs,
  envPairs
}
