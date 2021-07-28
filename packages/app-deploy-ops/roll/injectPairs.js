/*
* roll/injectPairs.js
*
* Provide the key/value pairs for injection for the main build.
*
* Note: We just collect the data here; how it's injected is up to the build.
*/
import { existsSync, readFileSync, readdirSync } from 'fs'

import { dirname } from 'path'
import { fileURLToPath } from 'url'

const myPath = dirname(fileURLToPath(import.meta.url));

const stageName = process.env["ENV"] || 'staging';

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

// Values from '.env.${ENV-staging}' (general)
//
const mainPairs = (_ => {
  const fn = `.env.${stageName}`;
  const envPath = myPath + `/../${fn}`;

  if (!existsSync(envPath)) {   // 'package.json' should have checked this
    fail(`No '${fn}' file found` );
  }

  const ReComment = /^#/;
  const ReKV = /^(.+?)=(.+)$/;     // no end-of-line comments

  const raw = readFileSync(envPath, 'utf-8');
  const lines = raw.split('\n');

  const pairs = lines
    .filter( line => ! (ReComment.test(line) || line.trim() === '') )
    .map( line => {
      const [_,c1,c2] = ReKV.exec(line) || fail(`Syntax error in '${fn}' (expecting 'key=value'): ${line}`);
      return [c1,c2];
    });

  return pairs;
})();   // Array of [string, string]

function fail(msg) { throw new Error(msg) }

export {
  proxyPairs,
  mainPairs
}
