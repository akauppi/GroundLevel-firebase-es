// jest.config.cjs

module.exports = {
  // Recommended for native ES6 use (Aug-20):
  testEnvironment: 'jest-environment-node',
  transform: {},

  testRunner: "jest-circus/runner",   // upcoming default for Jest (should be faster/better...)

  // Default is 5000. None of our tests take that long; fail fast.
  testTimeout: 2000,

  // Needed for using 'firebase-jest-testing', until Jest resolver supports modules with 'exports' (see TRACK.md).
  resolver: "../hack-jest/custom-resolver.cjs"
};
