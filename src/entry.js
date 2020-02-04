/*
* Firebase UI initialization
*
* Note: Here since 'index.html' doesn't get processed through Rollup (and we use 'import' for getting 'firebaseui'
*       and 'firebase').
*/
const elContainerSelector = '#firebaseui-auth-container';

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

// tbd. Could use Promises 'firebaseProm' and 'firebaseuiProm', that materialize to the loaded globals. This way,
//      '.addEventListener' could be shuffed into index.html. (we don't really want to deal with 'document', here)
//
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the FirebaseUI Widget using Firebase
    const ui = new firebaseui.auth.AuthUI(firebase.auth());

    ui.start(elContainerSelector, uiConfig);
    uiInit(elContainerSelector);
} );

import { app } from './app';

app.$mount('app');
