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
- `vue` 3 CLI
  - `npm install -g @vue/cli`

### Firebase project

See [DEVS/Creating Firebase project.md](DEVS/Creating Firebase project.md) for details.

```
$ firebase login
```

## Getting started

Fetch dependencies:

```
$ npm install
```

### Development workflow

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

Deployment is left out from this template. You should be able to do it simply by `firebase deploy`.


## Help needed!

If you wish to help, check out:

- [TODO.md](TODO.md)
- [Issues](https://github.com/akauppi/vue-rollup-example-with-firebase-auth/issues)

Issues has more formal definition of shortcomings, and is the main forum of contributions and discussion. `TODO` is a shorthand for authors.

In particular:

- help from Vue and/or Rollup aficiados, to check whether the configs are Best in class ☺️

## References

- [Handling 3rd-party JavaScript with Rollup](https://engineering.mixmax.com/blog/rollup-externals/) (blog, Dec 2017)


