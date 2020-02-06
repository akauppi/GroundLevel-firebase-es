import Vue from 'vue';    // ignore IDE warning (Q: how to disable the warning in WebStorm?)

import App from './App.vue';

const app = new Vue({
  data: {
    signedIn: null    // Boolean, once Firebase UI sets it      // tbd. how to make this read-only to others? #vue-advice
  },
  render: h => h(App)    // Q: what's the difference between this and 'el: ...'. Which should we use?  #vue-advice
});

/*
* Keep 'app.signedIn' up to date.
*/
firebaseLoadedProm.then( () => {
  firebase.auth().onAuthStateChanged( (user) => {
    if (user) {   // user is signed in
      const displayName = user.displayName;
      const email = user.email;
      const emailVerified = user.emailVerified;
      const photoURL = user.photoURL;
      const uid = user.uid;
      const phoneNumber = user.phoneNumber;
      const providerData = user.providerData;
      user.getIdToken().then( (accessToken) => {
        console.log("Signed in with: "+ JSON.stringify({
          displayName: displayName,
          email: email,
          emailVerified: emailVerified,
          phoneNumber: phoneNumber,
          photoURL: photoURL,
          uid: uid,
          accessToken: accessToken,
          providerData: providerData
        }, null, '  '));
      });

      app.signedIn = displayName;     // name to show in the UI

    } else {    // signed out
      console.log("Signed out.");
      app.signedIn = false;
    }
  }, function(error) {
    console.log(error);
  });
});

export { app };   // Q: is this needed?  If we use 'el' instead of 'render', do we need it?


