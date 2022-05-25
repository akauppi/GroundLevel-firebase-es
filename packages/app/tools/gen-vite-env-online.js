#!/usr/bin/env node

/*
* tools/gen-vite-env-online.js
*
* Expects:
*   ./firebase.js to exist
*
* Usage:
*   <<
*     $ gen-vite-env-online
*   <<
*
* Based on the 'firebase.js' file, prepare content for '.env' file for online mode.
*
* Output to stdout.
*/
const fn = '../firebase.js';

const SENTRY_DNS = process.env['SENTRY_DNS'];     // optional

// tbd. Use top-level-await (Node.js 14.8+ and we have 16.x, guaranteed).

/*await*/ import(fn).then( (mod) => {
  const { projectId, appId, apiKey, authDomain } = mod.default;
  (apiKey && appId && authDomain && projectId) || fail(`Some values missing from: ${fn.replace("../","") }`);

  const out = `# Generated based on '${fn}'.
#
VITE_API_KEY=${apiKey}
VITE_APP_ID=${appId}
VITE_AUTH_DOMAIN=${authDomain}
VITE_PROJECT_ID=${projectId}${
  SENTRY_DNS ? `\nVITE_SENTRY_DNS=${SENTRY_DNS}` : ''
}
`;

  process.stdout.write(out);

}).catch(err => {
  process.stderr.write(`ERROR: ${err.message}\n\n`);
  process.exit(2);
});

function fail(msg) { throw new Error(msg); }
