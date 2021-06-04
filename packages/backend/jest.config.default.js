// jest.config.default.js
//
// Common values to 'test-fns' and 'test-rules'

const opts = {
  //testEnvironment: 'jest-environment-node',

  // Recommended for native ES6 use: https://jestjs.io/docs/next/ecmascript-modules
  transform: {},

  // Default is 5000.
  //
  testTimeout: 2000,

  // Without this, the 'firebase-jest-testing' modules are not correctly loaded, due to being declared using 'exports'.
  // Jest 27.0.1 resolver (aka browserify resolver) is not up to this, yet (May 2021).
  //
  // See -> https://github.com/akauppi/firebase-jest-testing/blob/master/TRACK.md#jest-cannot-handle-package-exports-%EF%B8%8F%EF%B8%8F%EF%B8%8F
  //
  // Comment out to test whether Jest needs it.
  resolver: "firebase-jest-testing/src/cjs/jestResolver.cjs"
};

export default opts;
