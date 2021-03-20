/*
* Operations options
*
* You can bring in adapters from the provided ones, or pull from npm.
*/
import { logger } from 'adapters/logging/googleCloudLogging'

const logging = [logger];

export {
  logging
}
