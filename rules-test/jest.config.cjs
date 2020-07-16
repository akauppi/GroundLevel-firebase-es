// jest.config.cjs

module.exports = {
  globalSetup: "./setup.jest.js",
  //testTimeout: 8000,    // default 5000 _per test_ is mostly fine

  // work-around to JEST Issue #7780. See TRACK.md
  testEnvironment: "./__test-utils__/custom-jest-environment.cjs"
};

