// jest.config.default.js
//
// Common values to 'test-fns' and 'test-rules'

const opts = {
  // Recommended for native ES6 use (Aug-20):
  testEnvironment: 'jest-environment-node',
  transform: {},

  // Default is 5000.
  //
  // While we'd like to limit this to 2000, that cuts out some slower computers. Keep an eye on the performance.
  //
  //  Mac Mini 20xx 4 core 16MB:  slowest < 600ms
  //  Cloud Build (CI):           ... tbd. ...
  //  Lenovo 20xx 2 core 12MB:    slowest ~ 3000ms
  //
  testTimeout: 4000,

  // Without this, the 'firebase-jest-testing' modules are not correctly loaded, due to being declared using 'exports'.
  // Jest 27.0.1 resolver (aka browserify resolver) is not up to this, yet (May 2021).
  //
  // See -> https://github.com/akauppi/firebase-jest-testing/blob/master/TRACK.md#jest-cannot-handle-package-exports-%EF%B8%8F%EF%B8%8F%EF%B8%8F
  //
  // Comment out to test whether Jest needs it.
  resolver: "firebase-jest-testing/src/cjs/jestResolver.cjs"
};

export default opts;
