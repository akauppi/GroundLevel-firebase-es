// back-end/test-rules/jest.config.cjs

module.exports = { ...require('../jest.config.default.cjs'),
  // Load docs, once at the beginning of the tests.
  globalSetup: "./setup.jest.js"
};
