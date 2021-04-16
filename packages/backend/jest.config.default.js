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
  // This is a perfectly valid way of declaring modules, but Jest 26.x resolver (aka browserify resolver) is not up to it,
  // yet (Aug-2020).
  //
  // See -> https://github.com/akauppi/firebase-jest-testing/blob/master/TRACK.md#jest-cannot-handle-package-exports-%EF%B8%8F%EF%B8%8F%EF%B8%8F
  //
  // Still needed with 27.0.0-next.8
  //
  //resolver: "firebase-jest-testing/cjs/jestResolver"
  resolver: "firebase-jest-testing/src/cjs/jestResolver.cjs"
};

export default opts;
