/*
* src/config.js
*
* Application configuration
*/
const allowAnonymousAuth = true;
const appTitle = "GroundLevel - sample app"

// as used by the browser. THIS MUST MATCH with what's in 'functions/index.js'
const functionsRegion = "europe-west3"

/*
* true: Vue warnings both on browser and dev server console
* false: only on browser
*/
const devVueWarningsToCentral = true;

export {
  allowAnonymousAuth,
  appTitle,
  functionsRegion,
  devVueWarningsToCentral
}
