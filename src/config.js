/*
* src/config.js
*
* Application configuration
*
* tbd. This could be in 'App.vue' or some other place - what is customary for Vue?
*/
const allowAnonymousAuth = true;

/*  So one can use as 'import { allowAnonymousAuth } from 'config''.
*
* Note: Cannot export one single object, with all fields, with the 'import' being able to import by field name:
*         -> https://stackoverflow.com/questions/29844074/es6-export-all-values-from-object
*/
export {
  allowAnonymousAuth
}
