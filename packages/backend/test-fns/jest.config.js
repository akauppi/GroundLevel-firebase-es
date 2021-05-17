// test-fns/jest.config.js

import opts from '../jest.config.default.js'

export default { ...opts,
  // Jest default is 5000. Here to help debugging, if some 'fns' test times out.
  testTimeout: 3000,
  globalSetup: "./setup.jest.js"
};
