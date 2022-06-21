// test-database-rules/jest.config.js

import opts from '../jest.config.default.js'

export default { ...opts,

  testTimeout: Math.max( opts.testTimeout, 8000 ),    //TEMP

  globalSetup: "./setup.jest.js"
};
