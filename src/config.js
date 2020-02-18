/*
* src/config.js
*
* Application configuration
*/
const allowAnonymousAuth = true;
const appTitle = "GroundLevel for Firebase-web";   // your title here

/*  So one can use as 'import { allowAnonymousAuth } from 'config''.
*
* Note: Cannot export one single object, with all fields, with the 'import' being able to import by field name:
*         -> https://stackoverflow.com/questions/29844074/es6-export-all-values-from-object
*/
export {
  allowAnonymousAuth,
  appTitle
}
