/*
* src/firebaseui.js
*
* Code having to do with Firebase UI
*
* References:
*   - firebaseui-web (GitHub)
*     --> https://github.com/firebase/firebaseui-web
*/
const uiConfig = {
  signInSuccessUrl: '<url-to-redirect-to-on-success>',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID //,
    //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    //firebase.auth.GithubAuthProvider.PROVIDER_ID,
    //firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    //firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
  ],
  // tosUrl and privacyPolicyUrl accept either url string or a callback function.
  // Terms of service url/callback.
  tosUrl: '<your-tos-url>',
  // Privacy policy url/callback.
  privacyPolicyUrl: function() {
    window.location.assign('<your-privacy-policy-url>');
  }
};

/*
* Called after loading the page.
*
* 'elContainerSelector': ... tbd. describe its use ...
*
* Uses:
*   'firebase', 'firebaseui' globals
*/
function uiInit(elContainerSelector) {
  // Initialize the FirebaseUI Widget using Firebase
  const ui = new firebaseui.auth.AuthUI(firebase.auth());

  ui.start(elContainerSelector, uiConfig);
}

export { uiInit };
