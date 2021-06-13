// test-fns/jest.config.js

import opts from '../jest.config.default.js'

export default { ...opts,
  // Docker might need slightly higher timeouts.
  //
  //testTimeout: 4000,

  globalSetup: "./setup.jest.js"
};
