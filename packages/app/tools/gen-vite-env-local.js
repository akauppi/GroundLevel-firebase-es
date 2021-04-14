/*
* tools/gen-vite-env-local.js
*
* Usage:
*   <<
*     node --harmony-top-level-await --experimental-json-modules
*       tools/... firebase.json
*   <<
*
* Reads the node side Firebase configuration and produces Vite environment config out of it. This allows the browser
* side to get copies of these build values.
*
* Output to stdout.
*/
const [firebaseJson] = process.argv.slice(2);

if (!firebaseJson) {
  process.stderr.write(`\nUsage: node --harmony-top-level-await --experimental-json-modules ${ process.argv[1] } firebase.json\n`);
  process.exit(1);
}

const json = await import(`../${firebaseJson}`).then( mod => mod.default )
  .catch( err => {
    console.error(`Failed to read '${firebaseJson}: ${err.message}`);
    process.exit(20);
  })

const { emulators } = json;

const [a,b,c] = [emulators.firestore?.port, emulators.functions?.port, emulators.auth?.port];

if (! (a && b && c)) {
  console.error("Faulty input - unable to read all ports!", { emulators });
  process.exit(3);
}
const projectId='app';    // fixed for now (could come from the caller)

const out =
`# Generated based on 'firebase.json'.
# DON'T MAKE CHANGES HERE. THIS FILE IS OVERRIDDEN by 'npm run dev[:local]'
#
VITE_FIRESTORE_PORT=${a}
VITE_FUNCTIONS_PORT=${b}
VITE_AUTH_PORT=${c}
VITE_PROJECT_ID=${projectId}
`;

process.stdout.write(out);
