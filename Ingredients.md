# Ingredients

As any template, one has made decisions. These fall into three categories: selection of libraries, target environment and the way the template app is designed (e.g. authentication and database usage). You can tinker with any of these, but in order to contribute to the template, we will remain focused and - hopefully - simple.

**Contains:**

- Vite
- Vue.js 3 beta + Vue-router
- Firebase-auth and Firebase UI
- Cloud Firestore

**Does *not* contain:**

- Vue CLI (not needed)
- Babel (not needed; can be easily added)
- VueX

Instead of Vue CLI, we use GitHub for getting started, Vite for development hosting and Firebase for deploying.

Instead of VueX (state management), we use Vue.js 3's reactivity.

**Consumed with:**

Browsers with native ES6 and async/await - [everything](https://www.caniuse.com/#search=async) except IE11 (but [even it is not forgotten](https://github.com/akauppi/GroundLevel-firebase-web/issues/5)).


## Authentication decisions

- Using [Firebase UI](https://firebase.google.com/docs/auth/web/firebaseui) library
- Having all pages require sign in. This has lead to:
  - Using redirect method for sign in (not popup).
  - There's no 'sign in' menu; you're either signed in, or you are at the sign-in page.

Your app needs may be different. Hopefully the code is easy enough to adapt. Please ask for help at e.g. Gitter - but the template itself will proceed with above app focus.

