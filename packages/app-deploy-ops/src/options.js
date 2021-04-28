/*
* src/options.js
*
* You can bring in adapters from the provided ones, or pull from npm.
*/
import { loggerGenGen } from '/@adapters/logging/proxy.js'

const cfLoggerGenProm = loggerGenGen( {
  maxBatchDelayMs: 5000,
  maxBatchEntries: 100
} );

const logging = [cfLoggerGenProm];
export {
  logging
}
