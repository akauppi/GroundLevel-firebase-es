// jest.config.default.js
//
// Common values to 'test-fns' and 'test-rules'

const opts = {
  // Recommended for native ES6 use: https://jestjs.io/docs/next/ecmascript-modules
  transform: {},

  // Default is 5000. None of our tests take that long; fail fast.
  testTimeout: 2000,

  // Without this, the 'firebase-jest-testing' modules don't load, due to being declared using 'exports'.
  // Jest 27.0.{1..4} resolver (aka browserify resolver) is not up to this, yet (Jun 2021).
  //
  // Comment out, to test whether Jest needs it.
  // See -> https://github.com/akauppi/firebase-jest-testing/blob/master/TRACK.md#jest-cannot-handle-package-exports-%EF%B8%8F
  //
  resolver: "firebase-jest-testing/src/cjs/jestResolver.cjs"
};

export default opts;
