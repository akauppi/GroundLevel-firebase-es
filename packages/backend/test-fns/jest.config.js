// test-fns/jest.config.js

import opts from '../jest.config.default.js'

export default { ...opts,
  //
  // Cloud Functions Emulator takes ~3400 ms on the first round (300 ms subsequently), **when launched under Docker**
  // (regardless of its memory settings...).
  //
  // When launched natively (macOS), the numbers are ~1000..1200 ms and ~289 ms.
  //
  testTimeout: 4000,

  globalSetup: "./setup.jest.js"
};
