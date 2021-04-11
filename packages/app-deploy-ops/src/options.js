/*
* src/options.js
*
* You can bring in adapters from the provided ones, or pull from npm.
*/
import { createLogger } from '/@adapters/logging/proxy.js'

const cfLoggerGenProm = createLogger( {
  maxBatchDelayMs: 5000,
  maxBatchEntries: 100
} );

const logging = [cfLoggerGenProm];
export {
  logging
}
