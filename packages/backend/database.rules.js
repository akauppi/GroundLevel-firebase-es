/*
* database.rules.js
*
* Rules for Realtime Database. It's only used from Cloud Functions, so user level access is banned.
*/

/*** NOT USED!! export default {
  rules: {
    ".read": false,
    ".write": false

    // Indexes take away warnings in app 'npm test'.
    //
    "incoming": {
      "incs": {
        ".indexOn": ["clientTimestamp"]
      }
    }
  }
}***/
