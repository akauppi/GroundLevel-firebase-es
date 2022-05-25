/*
* src/config.js
*
* Application configuration
*/
//const allowAnonymousAuth = true;
const appTitle = "GroundLevel - sample app"

/*
* Pick the way Firebase auth should persist (or not).
*
* "Authentication State Persistence" (Firebase docs)
*   -> https://firebase.google.com/docs/auth/web/auth-state-persistence
*
* "Applications with sensitive data may want to clear the state when the window or tab is closed. This is important
* in case the user forgets to sign out."
*   => choose "NONE"
*
* "The developer is unable to tell how that application is accessed and may want to provide a user with the ability
* to choose whether to persist their session or not. This could be done by adding a "Remember me" option during sign-in."
*   => we could provide this feature (in fact, 'aside-keys' can, and configure Firebase auth accordingly..)
*/
//const authPersistenceLevel = 'none';   // 'local'/'session'/'ask'/'none'  (tbd. handle with 'aside-keys', in App/index.vue)

export {
  //allowAnonymousAuth,
  appTitle
}
