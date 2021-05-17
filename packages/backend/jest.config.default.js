// jest.config.default.js
//
// Common values to 'test-fns' and 'test-rules'

const opts = {
  // Recommended for native ES6 use (Aug-20):
  testEnvironment: 'jest-environment-node',
  transform: {},

  testRunner: "jest-circus/runner",   // upcoming default for Jest (should be faster/better...)

  // Default is 5000. None of our tests take that long; fail fast.
  testTimeout: 2000,

  // Without this, the 'firebase-jest-testing' modules are not correctly loaded, due to being declared using 'exports'.
  // Jest 27.0.0-next.9 resolver (aka browserify resolver) is not up to this, yet (May 2021).
  //
  // See -> https://github.com/akauppi/firebase-jest-testing/blob/master/TRACK.md#jest-cannot-handle-package-exports-%EF%B8%8F%EF%B8%8F%EF%B8%8F
  //
  // Comment out to test whether Jest needs it.
  resolver: "firebase-jest-testing/src/cjs/jestResolver.cjs"
};

export default opts;
