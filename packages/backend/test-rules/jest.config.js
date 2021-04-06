// test-rules/jest.config.js

import defaults from '../jest.config.default.js'

const opts = { ...defaults,
  // Load docs, once at the beginning of the tests.
  globalSetup: "./setup.jest.cjs"
};

export default opts;
