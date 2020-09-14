/*
* src/config.js
*
* Application configuration
*/
const allowAnonymousAuth = true
const appTitle = "GroundLevel - sample app"

// as used by the browser. THIS MUST MATCH with what's in 'functions/index.js'
const functionsRegion = "europe-west3"

// Account specific values (note: not really secrets, they are available to anyone having access to the front end)
import { airbrake } from '../.env.js'

// tbd. eventually bring also Firebase account via 'env.js' (deprecating '__.js'); #document
const firebase = { type: 'firebase' }

const ops = {
  perf: [firebase],
  errors: [airbrake],
  logs: [airbrake]
}

export {
  allowAnonymousAuth,
  appTitle,
  functionsRegion,
  ops
}
