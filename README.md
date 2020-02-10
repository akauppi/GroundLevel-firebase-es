# GroundLevel: firebase-web-auth

<!-- tbd. logo of GroundLevel -->

Based on [jonataswalker/vue-rollup-example](https://github.com/jonataswalker/vue-rollup-example).

Changes from the above:

- Jonatas's code is unlicensed. This is MIT licensed.
- Simplified `package.json` a bit
- updated dependencies
- `package-lock.json` disabled (just a matter of taste...)
- added `dev` target for "watch" workflow
- using `public` as the public folder (Firebase Hosting default)
- targeting "evergreen" ([ES6 compatible](https://caniuse.com/#search=ES6%20modules)) browsers.
  - for IE11 support, add [@rollup/plugin-buble](https://github.com/rollup/plugins/tree/master/packages/buble) to `package.json` and `rollup.config.js`

---
  
The repo provides a non-project-specific template for bringing a web app with authentication online, using Vue, Rollup and Firebase.

The choice of technologies (other than Firebase) can be changed. E.g. use of Svelte 3 instead of Vue at some point is a possibility.

**Opinionated**

As any template, one has made decisions. These mostly fall to how Firebase authentication is being used. It's good you know about these - other ways are also possible but you'd need to tinker with the code.

- Using [Firebase UI](https://firebase.google.com/docs/auth/web/firebaseui) library
- Using redirect (not popup) method for sign in. Firebase UI provides both. The choice is because of how we want the app to behave.
- Instead of a 'sign in' menu (in place of the user profile), we require the user to always sign in. Another approach could have been to keep a "website" integrated with the app, but in this case we do an "app" only and a website (which requires no authentication) would be maintained separately.

As stated, you can tinker with the code if you don't feel these choices match your needs.

<!--
**Used in**
This template has been used in the following applications:

- ...

! Your application reference appreciated here; even if it were commercial and closed source, you may be able to share the name. :)
-->


## Requirements

- `npm`
- `firebase`
  - `npm install -g firebase-tools`
- `vue`
  - `npm install -g @vue/cli`

>Note: `@vue/cli` is the new version; `vue-cli` shown in some tutorials is the one it deprecates. Note: Vue CLI version 3 doesn't mean Vue version 3. You can use it to target Vue 2 as well. :)

### Firebase project

You need to:

- create a Firebase project
- enable hosting and authentication
  - you can choose the set of authentication providers you like (we use Google)
- `firebase login`
- `firebase use --add` to activate the project for this working directory

See [DEVS/Setting up Firebase project](DEVS/Setting%20up%%20Firebase%20project.md) for details.

>Note: `firebase use` when there's a cloned template like this; to create one you'd use `firebase init`.

<!-- Editor's note: no need to provide more details?...
-->


## Getting started

Fetch dependencies:

```
$ npm install
```

There are currently no tests for the project. 😢

## Development workflow

```
$ npm run dev
```

Serves the project locally, reacting to source code changes.


## Production build

```
$ npm run build
$ firebase serve
...
```

Then open http://localhost:5000


## Deploy

```
$ firebase deploy

=== Deploying to 'vue-rollup-example'...

i  deploying hosting
i  hosting[vue-rollup-example]: beginning deploy...
i  hosting[vue-rollup-example]: found 3 files in ./public
✔  hosting[vue-rollup-example]: file upload complete
i  hosting[vue-rollup-example]: finalizing version...
✔  hosting[vue-rollup-example]: version finalized
i  hosting[vue-rollup-example]: releasing new version...
✔  hosting[vue-rollup-example]: release complete

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/vue-rollup-example/overview
Hosting URL: https://vue-rollup-example.firebaseapp.com
```

You can now reach the app in the stated URL: [https://vue-rollup-example.firebaseapp.com](https://vue-rollup-example.firebaseapp.com)

>Note: These instructions are not complete, nor does it make sense to duplicate Firebase documentation (it being awesome!! 🥳). Check e.g. [Test locally then deploy to your site](https://firebase.google.com/docs/hosting/deploying)

<font color=red>tbd. write about A/B testing</font>

<font color=red>tbd. write about monitoring</font>


## Help needed!

If you wish to help, check out:

- [TODO.md](TODO.md)
- [Issues](https://github.com/akauppi/vue-rollup-example-with-firebase-auth/issues)

Issues has more formal definition of shortcomings, and is the main forum of contributions and discussion. `TODO` is a shorthand for authors.

In particular:

- help from Vue and/or Rollup aficiados, to check whether the configs are Best in class ☺️

## References

- [Handling 3rd-party JavaScript with Rollup](https://engineering.mixmax.com/blog/rollup-externals/) (blog, Dec 2017)

- [Firebase web Codelab](https://codelabs.developers.google.com/codelabs/firebase-web/#1)
  - A walk-through that we followed, and took inspiration from
  - [source repo](https://github.com/firebase/friendlychat-web) (GitHub)
 
- [Easily add sign-in to your Web app with FirebaseUI](https://firebase.google.com/docs/auth/web/firebaseui) (Firebase docs)

- [Vue, guard routes with Firebase Authentication](https://dev.to/gautemeekolsen/vue-guard-routes-with-firebase-authentication-f4l) (blog, Nov 2019) 
  - associated [source code](https://github.com/gautemo/Vue-guard-routes-with-Firebase-Authentication) (GitHub)

- [gautemo/Vue-guard-routes-with-Firebase-Authentication](https://github.com/gautemo/Vue-guard-routes-with-Firebase-Authentication) (GitHub)
  - learned about Vue-router with Firebase auth here! :)
