/*
* tools/gen-vite-env-online.js
*
* Expects:
*   '../../firebase.${ENV:-staging}.js' to exist
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
const ENV = process.env["ENV"] || 'staging';
const fn = `../../firebase.${ENV}.js`;

const SENTRY_DSN = process.env['SENTRY_DSN'];     // optional

const { projectId, appId, apiKey, authDomain, locationId, databaseURL } = await import(`../${fn}`).then(mod => mod.default)
  .catch(err => {
    process.stderr.write(`ERROR: ${err.message}\n\n`);
    process.exit(2);
  });

(apiKey && appId && authDomain && projectId && locationId)
  || fail(`Some values missing from: ${fn}`);

const out = `# Generated based on '${fn}'.
#
VITE_API_KEY=${apiKey}
VITE_APP_ID=${appId}
VITE_AUTH_DOMAIN=${authDomain}
VITE_PROJECT_ID=${projectId}
VITE_LOCATION_ID=${locationId}
${
  databaseURL ? `VITE_DATABASE_URL=${databaseURL}` : ''
}
${
  SENTRY_DSN ? `VITE_SENTRY_DSN=${SENTRY_DSN}` : ''
}
`;

process.stdout.write(out);

function fail(msg) { throw new Error(msg); }
