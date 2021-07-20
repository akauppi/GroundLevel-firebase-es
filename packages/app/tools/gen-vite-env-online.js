#!/usr/bin/env node

/*
* tools/gen-vite-env-online.js
*
* Usage:
*   <<
*     $ [ENV=...] gen-vite-env-online
*   <<
*
* Based on the '../../../firebase.${ENV-staging}.js' file, prepare content for '.env' file for online mode.
*
* Output to stdout.
*/
const staging = process.env["ENV"] || "staging";

const fn = `../../../firebase.${staging}.js`;

/*await*/ import(fn).then( (mod) => {
  const { projectId, appId, apiKey, authDomain } = mod.default;
  (apiKey && appId && authDomain && projectId) || fail(`Some values missing from: ${ fn.replace("../","") }`);

  const out =
    `# Generated based on '../../firebase.${staging}.js'.
# DON'T MAKE CHANGES HERE. THIS FILE IS OVERRIDDEN by 'npm run dev:online'
#
VITE_API_KEY=${apiKey}
VITE_APP_ID=${appId}
VITE_AUTH_DOMAIN=${authDomain}
VITE_PROJECT_ID=${projectId}
`;

  process.stdout.write(out);

}).catch(err => {
  process.stderr.write(`ERROR: ${err.message}\n\n`);
  process.exit(2);
});

function fail(msg) { throw new Error(msg); }
