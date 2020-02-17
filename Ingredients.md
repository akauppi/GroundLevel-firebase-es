# Ingredients

As any template, one has made decisions. These fall into three categories: selection of libraries, target environment and the way the template app is designed (e.g. authentication and database usage). You can tinker with any of these, but in order to contribute to the template, we will remain focused and - hopefully - simple.

**Contains:**

- Rollup
- Vue.js 2 + Vue-router
- Firebase-auth and Firebase UI

**Does not contain:**

- Vue CLI usage

**Consumed with:**

Browsers with native ES6 and async/await - [everything](https://www.caniuse.com/#search=async) except IE11 (but [even it is not forgotten](https://github.com/akauppi/GroundLevel-firebase-web/issues/5)).


## Authentication decisions

- Using [Firebase UI](https://firebase.google.com/docs/auth/web/firebaseui) library
- Using redirect (not popup) method for sign in. The choice is because of how we want the app to behave.
- Instead of a 'sign in' menu (in place of the user profile), we require the user to *always* sign in.

You can tinker with the code if you don't feel these choices match your needs.
