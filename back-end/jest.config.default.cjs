// back-end/jest.config.default.cjs
//
// Default values common to 'test-fns' and 'test-rules'.

module.exports = {
  // Recommended for native ES6 use (Aug-20):
  testEnvironment: 'jest-environment-node',
  transform: {},

  testRunner: "jest-circus/runner",   // upcoming default for Jest (should be faster/better...)

  // Default is 5000. None of our tests take that long; fail fast.
  testTimeout: 2000,

  // Without this, the 'firebase-jest-testing' modules are not correctly loaded, due to being declared using 'exports'.
  // This is a perfectly valid way of declaring modules, but Jest 26.x resolver (aka browserify resolver) is not up to it,
  // yet (Aug-2020). See 'TRACK.md'.
  //
  //resolver: "firebase-jest-testing/jestResolver"
  resolver: "firebase-jest-testing/src/cjs/jestResolver.cjs"
};
