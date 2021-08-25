#!/usr/bin/env node

/*
* hack/ack-await.js key [...]
*
* Context:
*   - called as a command line tool, to wait for the turning up of a certain file.
*
* Usage:
*   <<
*     $ hack/ack-await.js <key> [...more keys...]
*   <<
*/
import { existsSync } from 'fs'

const keys = process.argv.slice(2);
if (keys.length === 0) {
  const [_,c1] = process.argv[1].match( /(hack\/.+)/ ) || [];

  process.stderr.write(`Usage: ${ c1 } key [...]\n`);
  process.exit(-1);
}

//--- Implementation ---
//
// Needs to precede the CLI part; otherwise "Cannot access [...] before initialization"

const POLL_DELAY_MS = 100;

async function waitUntil(f) {   // (() => Boolean) => Promise of ()
  while( !f() ) {
    await waitMs(POLL_DELAY_MS);
  }
}

const waitMs = ms => new Promise( (resolve) => {
  setTimeout(resolve, ms);
});

//--- CLI ---

const proms = keys.map( async k => {
  const fn = `./functions/.ack.${k}`;

  console.debug(`Waiting for: ${fn}`);

  await waitUntil(() => existsSync(fn));

  console.debug(`Detected: ${fn}`);
} );

await Promise.all(proms);   // top-level-await (ignore the IDE highlighting; it's fine!)
