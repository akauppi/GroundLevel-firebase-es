// test-fns/jest.config.js

import opts from '../jest.config.default.js'

export default { ...opts,

  // Increase timeout. Iff launched via 'npm test' execution times can be:
  //  4662 ms logging test (DC 4.6)
  //  5141 ms userinfo test (DC 4.6)
  //
  testTimeout: Math.max( opts.testTimeout, 9000 ),

  globalSetup: "./setup.jest.js"
};
