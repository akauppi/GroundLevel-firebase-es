// jest.config.default.js
//
// Common values to 'test-fns' and 'test-firestore-rules'

// Allow more time for the warm-up lap.
//
const warmUpTimeoutMs = parseInt( process.env["WARM_UP_TIMEOUT"] ) || null;

export default {
  // Recommended for native ES6 use: https://jestjs.io/docs/next/ecmascript-modules
  transform: {},

  // Default is 5000. None of our tests take that long; fail fast.
  testTimeout: warmUpTimeoutMs || 2000,

  // need to explicitly import 'test' etc.
  injectGlobals: false
}
