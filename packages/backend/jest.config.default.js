// jest.config.default.js
//
// Common values to 'test-fns' and 'test-rules'

// Allow more time for the warm-up lap.
//
const warmUpTimeoutMs = parseInt( process.env["WARM_UP_TIMEOUT"] ) || null;

const opts = {
  // Recommended for native ES6 use: https://jestjs.io/docs/next/ecmascript-modules
  transform: {},

  // Default is 5000. None of our tests take that long; fail fast.
  testTimeout: warmUpTimeoutMs || 2000,

  // need to explicitly import 'test' etc.
  injectGlobals: false,

  // Without this, ESM modules with more than the default entry point don't load.. Jest 28 should not need this.
  resolver: "../hack-jest/jestResolver.cjs"
};

export default opts;
