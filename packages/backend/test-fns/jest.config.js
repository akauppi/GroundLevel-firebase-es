// test-fns/jest.config.js

import opts from '../jest.config.default.js'

export default { ...opts,
  //
  // Cloud Functions Emulator takes ~3400..>4000 ms on the first round (300 ms subsequently), **when launched under
  // Docker** (regardless of its memory settings...).
  //
  // tbd. If we can reduce the first-time Cloud Functions latency, the timeout can be dropped dramatically (to 2000 ms)!!
  //
  // When launched natively (macOS), the numbers are ~1000..1200 ms and ~289 ms.
  //
  testTimeout: 6000,

  globalSetup: "./setup.jest.js"
};
