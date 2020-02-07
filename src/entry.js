/*
* src/entry.js
*
* The entry point for the bundle.
*
* Handles:
*   - Firebase UI (non-application specific parts); together with 'index.html' that loads it
*
* Delegates:
*   - Application stuff to './app'
*/
const elContainerSelector = '#firebaseui-auth-container';

const allowAnonymousAuth = true;

const uiConfig = {
    // We use redirect (default)
    //signInFlow: 'popup',

    signInSuccessUrl: '<url-to-redirect-to-on-success>',        // tbd.!!!
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

    autoUpgradeAnonymousUsers: allowAnonymousAuth,

    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>',

    callbacks: {
        signInSuccessWithAuthResult: () => {    //
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
        },
        uiShown: () => {
            // The widget is rendered. (can hide a loader but we have none)
        },

        // 'signInFailure' callback must be provided to handle merge conflicts which
        // occur when an existing credential is linked to an anonymous user.
        //
        signInFailure: (error) => {
            if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
                return Promise.resolve();
            }

            // The credential the user tried to sign in with.
            const cred = error.credential;

            // Copy data from anonymous user to permanent user and delete anonymous user.
            // ...
            // Finish sign-in after data is copied.
            return firebase.auth().signInWithCredential(cred);
        }
    },
};

firebaseLoadedProm.then( () => {
    // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    //
    // firebase.auth().onAuthStateChanged(user => { });
    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    //
    // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

    // Initialize the FirebaseUI Widget using Firebase
    const ui = new firebaseui.auth.AuthUI(firebase.auth());

    // Note: Checking '.isPendingRedirect' is connected to using 'firebase.auth.EmailAuthProvider', but it doesn't harm
    //      for other means.
    //
    // "When rendering the sign-in UI conditionally (relevant for single page apps), use 'ui.isPendingRedirect()' to detect
    // if the URL corresponds to a sign-in with email link and the UI needs to be rendered to complete sign-in."
    //      source -> https://firebase.google.com/docs/auth/web/firebaseui
    //
    if (ui.isPendingRedirect()) {
        let data = null;    // anonymous user data if needed

        const anonymousUser = allowAnonymousAuth && firebase.auth().currentUser;  // reference to the anonymous current user


        ui.start( elContainerSelector, uiConfig);

        console.log("FirebaseUI initialized.")
    }
} );

import { app } from './app';
