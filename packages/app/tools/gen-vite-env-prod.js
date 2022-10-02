/*
* tools/gen-vite-env-prod-serve.js
*
* Prepare content for '.env' file for a local production build.
*
* NOTE: This DOES NOT AFFECT PRODUCTION itself (CI/CD does that), but only the 'make serve' variant usable locally.
*   To separate such (in metrics and logging) from actual deployments, the 'release' attribute is empty.
*
* Output to stdout.
*/
const ENV = process.env["ENV"] || 'staging';

const out = `# Generated
#
VITE_STAGE=${ENV}
`;

process.stdout.write(out);
