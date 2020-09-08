/*
* src/config.js
*
* Application configuration
*/
const allowAnonymousAuth = true
const appTitle = "GroundLevel - sample app"

// as used by the browser. THIS MUST MATCH with what's in 'functions/index.js'
const functionsRegion = "europe-west3"

import { ops } from '../.env.js'

export {
  allowAnonymousAuth,
  appTitle,
  functionsRegion,
  ops
}
