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

const SENTRY_DSN = process.env['SENTRY_DSN'];     // optional

const { projectId, appId, apiKey, authDomain, locationId } = await import(fn).then(mod => mod.default)
  .catch(err => {
    process.stderr.write(`ERROR: ${err.message}\n\n`);
    process.exit(2);
  });

(apiKey && appId && authDomain && projectId && locationId)
  || fail(`Some values missing from: ${fn.replace("../","") }`);

const out = `# Generated based on '${fn}'.
#
VITE_API_KEY=${apiKey}
VITE_APP_ID=${appId}
VITE_AUTH_DOMAIN=${authDomain}
VITE_PROJECT_ID=${projectId}
VITE_LOCATION_ID=${locationId}${
  SENTRY_DSN ? `\nVITE_SENTRY_DSN=${SENTRY_DSN}` : ''
}
`;

process.stdout.write(out);

function fail(msg) { throw new Error(msg); }
