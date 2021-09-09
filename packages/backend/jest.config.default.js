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

  // Without this, the 'firebase-jest-testing' modules don't load, due to being declared using 'exports'.
  // Jest 27.0.{1..4} resolver (aka browserify resolver) is not up to this, yet (Jun 2021).
  //
  // TESTING whether this is still needed:
  //  - comment it out
  //  - 'docker compose down'
  //  - 'docker compose up warm-up'
  //
  // If the warm-up happens great, Jest was able to resolve the modules, on its own.
  //
  resolver: "firebase-jest-testing/src/cjs/jestResolver.cjs"
    //  27.1.1  still needs it
};

export default opts;
