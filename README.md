# vue-rollup-example-with-firebase-auth

Based on [jonataswalker/vue-rollup-example](https://github.com/jonataswalker/vue-rollup-example).

**Changes**

- Jonatas's code is unlicensed. This is MIT licensed.
- Simplified `package.json` a bit (an app template doesn't need to be exported)
- updated dependencies
- `package-lock.json` disabled (just a matter of taste...)
- added `dev` target for "watch" workflow
- using `public` as the public folder (Firebase Hosting default); `dist` and `index.html` moved there.
- targeting "evergreen" ([ES6 compatible](https://caniuse.com/#search=ES6%20modules), not IE11) browsers.
  - for IE11 support, add [@rollup/plugin-buble](https://github.com/rollup/plugins/tree/master/packages/buble) to `package.json` and `rollup.config.js`

---
  
The repo provides a non-project-specific template for bringing a web app online, with Vue, Rollup and Firebase authentication.

<!--
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

See [DEVS/Setting up a Firebase project.md](Setting up a Firebase project.md) for details.

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

 