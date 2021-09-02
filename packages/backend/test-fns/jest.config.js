// test-fns/jest.config.js

import opts from '../jest.config.default.js'

export default { ...opts,
  globalSetup: "./setup.jest.js"
};
