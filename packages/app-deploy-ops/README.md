# app-deploy-ops

Takes the app developed in `../app` sister package, and prepares it for operations.

Adds:

- ops instrumentation code (central logging, performance monitoring, crash reporting, etc.)
- Firebase initialization

Note: Since we get the application logic as a module dependency, we don't expect anything from it. It can use any web framework - not only Vue.js 3.

## Requirements

- npm
- `firebase-tools`

### Firebase

There is an active project; you've run `firebase use --add`.

## Getting started

Install dependencies.

```
$ npm install
```

```
$ npm run build
...
building for production...
✓ 34 modules transformed.
public/index.html                                      0.95kb
public/assets/index.7c0c45a7.js                        2.14kb / brotli: 0.89kb
public/assets/firebase-functions.b2221096.js           9.84kb / brotli: 2.52kb
public/assets/app.es.306d8b05.js                       32.46kb / brotli: 11.26kb
public/assets/vite.d0d1ba23.js                         0.61kb / brotli: 0.31kb
public/assets/tslib.d012e74f.js                        3.52kb / brotli: 1.42kb
public/assets/index.6ca839e5.js                        1.34kb / brotli: 0.62kb
public/assets/tslib.es6.6591dcdb.js                    8.04kb / brotli: 1.52kb
public/assets/index.esm.4d59513a.js                    79.01kb / brotli: 19.63kb
public/assets/firebase-misc.13a81d66.js                56.44kb / brotli: 16.90kb
public/assets/vue-router.c9fdcf42.js                   20.77kb / brotli: 7.53kb
public/assets/vue.2105b663.js                          43.16kb / brotli: 15.59kb
public/assets/firebase-auth.41bd0100.js                175.82kb / brotli: 46.94kb
public/assets/firebase-firestore.9cd767af.js           293.76kb / brotli: 55.95kb
public/assets/prebuilt-7840cb8c-52081c7f.8ccbd7ac.js   293.31kb / brotli: 55.79kb
public/assets/auth.esm.9e24d3a1.js                     175.91kb / brotli: 46.98kb
```

After the command you have a ready-to-be-deployed web app under `public`:

```
$ tree public
public
├── assets
│   ├── app.es.306d8b05.js
│   ├── auth.esm.9e24d3a1.js
│   ├── firebase-auth.41bd0100.js
│   ├── firebase-firestore.9cd767af.js
│   ├── firebase-functions.b2221096.js
│   ├── firebase-misc.13a81d66.js
│   ├── index.6ca839e5.js
│   ├── index.7c0c45a7.js
│   ├── index.esm.4d59513a.js
│   ├── prebuilt-7840cb8c-52081c7f.8ccbd7ac.js
│   ├── tslib.d012e74f.js
│   ├── tslib.es6.6591dcdb.js
│   ├── vite.d0d1ba23.js
│   ├── vue-router.c9fdcf42.js
│   └── vue.2105b663.js
└── index.html
```

### Try it out

```
$ npm run serve

> serve
> firebase serve --only hosting --host 0.0.0.0 --port 3012

i  hosting: Serving hosting files from: public
✔  hosting: Local server: http://0.0.0.0:3012
...
```

Visit [http://localhost:3012](http://localhost:3012) and you should see a UI.

><font color=red>BUG: currently broken! Apologies.</font>

## Deploying

```
$ npm run deploy

> deploy
> firebase deploy --only hosting


=== Deploying to 'groundlevel-160221'...

i  deploying hosting
i  hosting[groundlevel-160221]: beginning deploy...
i  hosting[groundlevel-160221]: found 16 files in public
✔  hosting[groundlevel-160221]: file upload complete
i  hosting[groundlevel-160221]: finalizing version...
✔  hosting[groundlevel-160221]: version finalized
i  hosting[groundlevel-160221]: releasing new version...
✔  hosting[groundlevel-160221]: release complete

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/groundlevel-160221/overview
Hosting URL: https://groundlevel-160221.web.app
```

You can now try the web app at the URL shown on the console:

[https://YOUR\_PROJECT\_ID.web.app](https://YOUR_PROJECT_ID.web.app)

>Note: The above only deploys the *front end*. If you haven't deployed the back end, yet, head to `../backend` sister package and follow its instructions.

<!-- tbd.??
---

<p align=right>Next: <a href="./README.ops.md">Ops monitoring</a></p>
-->