/*
* src/fns.js
*
* This module is needed because Firebase 'getFunctions' needs to be spoon-fed with 'regionOrCustomDomain' parameter.
* as if it couldn't already know it, otherwise. This kind of configurations should *not* need to be in application
* sources. Please, separate CONFIGURATION from sources.
*
* FLAME:
*   Such API details give a consistent feeling that REGIONS IS AN AFTER-THOUGHT for Firebase. The API should be revised,
*   to get rid of such ridiculous extra complexity on application developers. Region should be a deployment setting.
* /FLAME
*
* Implementation:
*   We know in 'main.js' what the region is (since it reads '/__/init.json'). It puts the 'locationId' aside for us.
*   Adapters needing access to 'httpsCallable' Cloud Functions can then call us, to have the handle properly initialized.
*/
import { assert } from './assert'

import { getFunctions } from '@firebase/functions'
import { getApp } from '@firebase/app'

import { locationId } from './main'

// Firebase needs to be spoon-fed the 'regionOrCustomDomain'; one would expect it to know (shouldn't be in source,
// anyhow).
//
const regionOrCustomDomain = locationId;  // eg. "us-central1" |"https://mydomain.com"
assert(regionOrCustomDomain, "Not having 'locationId'");

const fnsRegional = getFunctions( getApp(), regionOrCustomDomain );

export {
  fnsRegional
}
