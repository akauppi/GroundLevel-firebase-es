// test-fns/jest.config.js

import opts from '../jest.config.default.js'

export default { ...opts,

  // Even with warm-up, the first 'npm test' might take a bit longer for the tests.
  //
  // Observed timings (Restart of Docker; 'npm test'):
  //
  //  Mac Mini 2018 (Intel); 4 cores; DC 4.9.0 (3 CPUs, 2GB):
  //    - userInfo  6391 ms
  //
  // It's better to allow those to pass. On next runs, they'll be faster.
  //
  testTimeout: Math.max( opts.testTimeout, 7000 ),

  globalSetup: "./setup.jest.js"
};
