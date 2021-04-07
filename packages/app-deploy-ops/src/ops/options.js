/*
* src/ops/options.js
*
* You can bring in adapters from the provided ones, or pull from npm.
*/
import { createLogger } from '/@adapters/logging/proxy.js'

const cfLoggerGen = createLogger(/*{..}*/);    // tbd. options?

const logging = [cfLoggerGen];
export {
  logging
}
