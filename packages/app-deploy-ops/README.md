# app-deploy-ops

Takes the app developed in `../app` sister package, and prepares it for operations.

Adds:

- ops instrumentation code (central logging, performance monitoring, crash reporting, etc.)
- Firebase initialization

We get the application logic as a module dependency, and don't expect anything from it (apart from it needing Firebase initialized). It can use any web framework, any libraries.


## Requirements

- npm
- `firebase-tools`

### Firebase

There is an active project; you've run `firebase use --add`.

## Getting started

Install dependencies:

```
$ npm install
```

Prepare and build `../app`:

```
$ (cd ../app && npm install && npm run build)
```

Build for deployment:

```
$ npm run vite:build
...
vite v2.0.5 building for production...
✓ 14 modules transformed.
out.vite/index.html                         0.46kb
out.vite/a/vite.8d06420f.js                 0.61kb / brotli: 0.31kb
out.vite/a/vite.8d06420f.js.map             2.43kb
out.vite/a/index.8c58fde3.js                1.17kb / brotli: 0.59kb
out.vite/a/index.8c58fde3.js.map            7.84kb
out.vite/a/app.es.072adeb2.js               28.84kb / brotli: 10.29kb
out.vite/a/app.es.072adeb2.js.map           88.72kb
out.vite/a/vue-router.7cd7ab50.js           20.91kb / brotli: 7.55kb
out.vite/a/vue-router.7cd7ab50.js.map       85.23kb
out.vite/a/vue.1b433da6.js                  44.58kb / brotli: 16.00kb
out.vite/a/vue.1b433da6.js.map              206.48kb
out.vite/a/firebase.74bd3f4b.js             83.94kb / brotli: 19.44kb
out.vite/a/firebase.74bd3f4b.js.map         224.37kb
out.vite/a/tslib.18355cd6.js                7.31kb / brotli: 1.63kb
out.vite/a/tslib.18355cd6.js.map            18.88kb
out.vite/a/firebase-auth.5f09abc8.js        213.33kb / brotli: 20.00kb
out.vite/a/firebase-auth.5f09abc8.js.map    563.96kb
out.vite/a/firebase-firestore.45be24f4.js   173.90kb / brotli: 34.09kb
out.vite/a/firebase-firestore.45be24f4.js.map 378.61kb
```

After the command you have a ready-to-be-deployed web app under `out.vite`:

```
$ tree out.vite/
out.vite/
├── a
│   ├── app.es.072adeb2.js
│   ├── app.es.072adeb2.js.map
│   ├── firebase-auth.5f09abc8.js
│   ├── firebase-auth.5f09abc8.js.map
│   ├── firebase-firestore.45be24f4.js
│   ├── firebase-firestore.45be24f4.js.map
│   ├── firebase.74bd3f4b.js
│   ├── firebase.74bd3f4b.js.map
│   ├── index.8c58fde3.js
│   ├── index.8c58fde3.js.map
│   ├── tslib.18355cd6.js
│   ├── tslib.18355cd6.js.map
│   ├── vite.8d06420f.js
│   ├── vite.8d06420f.js.map
│   ├── vue-router.7cd7ab50.js
│   ├── vue-router.7cd7ab50.js.map
│   ├── vue.1b433da6.js
│   └── vue.1b433da6.js.map
└── index.html
```

>Note: For some reason one of the chunks is called `index` instead of `ops`. That's unintended.

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