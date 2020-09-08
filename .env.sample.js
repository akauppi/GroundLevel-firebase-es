// .env.js
//
// Operational configuration. Gets merged to 'src/config.js' at build time.
//
// The values are used for logging of 'dev:online' and production.
//
// NOTE: The values are *not* secret since they get exposed in the client. You can add the `.env.js` file
//       to version control, or place the values directly to 'src/config.js'.
//
const ops = {
  // Airbrake
  projectId: '...',
  projectKey: '...'
}

export { ops }
