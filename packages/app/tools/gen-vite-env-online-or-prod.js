/*
* tools/gen-vite-env-online-or-prod.js
*
* Prepare content for '.env' file for a production build.
*
* NOTE:
*   For local ('make build; make serve') production builds, environment can be tweaked (e.g. optional keys) via
*   '.env.${ENV}'. THIS IS ONLY FOR THE LOCAL BUILDS.
*
*   For actual deployment, CI/CD takes care of the env.vars. (they might come from CI/CD system's properties).
*
* Output to stdout.
*/
const ENV = process.env["ENV"] || 'staging';

const out = `# Generated
#
VITE_STAGE=${ENV}
`;

process.stdout.write(out);
