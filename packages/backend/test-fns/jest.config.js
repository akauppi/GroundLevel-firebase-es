// test-fns/jest.config.js

import defaults from '../jest.config.default.js'

const opts = { ...defaults,
  // Jest default is 5000. Here to help debugging, if some 'fns' test times out.
  testTimeout: 3000,
};

export default opts;
