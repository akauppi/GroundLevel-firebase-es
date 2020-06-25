/*
* src/config.js
*
* Application configuration
*/
const allowAnonymousAuth = true
const appTitle = "GroundLevel - sample app"

// as used by the browser. THIS MUST MATCH with what's in 'functions/index.js'
const functionsRegion = "europe-west3"

// Firebase config for dev (also useful if you deploy with something else than Firebase Hosting)
//
const dev = {
  apiKey: "AIzaSyD29Hgpv8-D0-06TZJQurkZNHeOh8nKrsk",
  projectId: 'vue-rollup-example',
  locationId: 'europe-west3'
}

export {
  allowAnonymousAuth,
  appTitle,
  functionsRegion,
  dev
}
