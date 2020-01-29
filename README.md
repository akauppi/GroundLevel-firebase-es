# vue-rollup-example-with-firebase-auth

Based on [jonataswalker/vue-rollup-example](https://github.com/jonataswalker/vue-rollup-example).

**Changes**

- Jonatas's code is unlicensed. This is MIT licensed.
- Simplified `package.json` a bit (an app template doesn't need to be exported)
- updated dependencies
- `package-lock.json` disabled (just a matter of taste...)
- added `dev` target for "watch" workflow
- using `public` as the public folder (Firebase Hosting default); `dist` and `index.html` moved there.

In addition, we target "evergreen" browsers, expecting EcmaScript 6 native support.


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


## References

...