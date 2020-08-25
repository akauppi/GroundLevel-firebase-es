// back-end/test-rules/jest.config.cjs

module.exports = { ...require('../jest.config.default.cjs'),
  // Default is 5000. None of our tests take that long; fail fast.
  testTimeout: 2000,

  // Load docs, once at the beginning of the tests.
  globalSetup: "./setup.jest.cjs"
};
