# app-deploy-ops

Takes the app developed in `../app` sister package and prepares it for operations.

Adds:

- ops instrumentation code (central logging, crash reporting, performance monitoring, etc.)
- Firebase initialization

We get the application logic as a module dependency, and don't expect anything from it (apart from it needing Firebase initialized). It can use any web framework, any libraries.


## Requirements

- npm
- `firebase-tools`

### Firebase

There is an active project; you've run `firebase use --add`.

## Alternatives: Vite or Rollup?

At the moment, both Vite and Rollup builds are supported. Why both?

### Vite

..is familiar as the `app` building environment. Vite's main strength is in the hot-module-reload development experience, but building for production is more of a normal, one time build step.

||Vite|
|---|---|
|*Pros*|Creates the `[module]preload`s to `index.html` automatically (simple)|
|*Cons*|Uses Rollup underneath; is it just an unneeded abstraction layer?|

To be close to production setup, we want to serve the built code with Firebase hosting emulation. This means, the HMR side of Vite won't be used, at all.

Since Vite doesn't have a watch mode, we ... kind of don't have watch in the Vite setup, at all (becomes confusing!). 😰


### Rollup

Great workhorse. Requires a bit more steering to do the tricks we want (see `roll/tools`).

||Rollup|
|---|---|
|*Pros*|Less dependencies (since Vite depends on Rollup)|
|*Cons*|More manual labor|
|*Unknowns*|Is the output as good/tight as Vite's?|

We'll keep supporting both, until it is clear which turns out to be the favoured choice.

In the `README`, just replace `build:vite` with `build:roll`, to try the other variant. 🙂


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
$ npm run build:vite
...
vite v2.0.5 building for production...
✓ 26 modules transformed.
vite/out/index.html                           2.50kb
vite/out/index.f12e5ae8.js                    1.59kb / brotli: 0.71kb
vite/out/index.f12e5ae8.js.map                8.41kb
vite/out/ops/vite.72e4391b.js                 0.61kb / brotli: 0.31kb
vite/out/ops/vite.72e4391b.js.map             2.42kb
...
vite/out/app/firebase-firestore.b27d841e.js   173.90kb / brotli: 33.99kb
vite/out/app/firebase-firestore.b27d841e.js.map 378.62kb
```

After the command you have a ready-to-be-deployed web app under `vite/out`.


### Try it out

```
$ npm run serve:vite
...
> serve:vite
> firebase serve --config firebase.vite.json --only hosting --host 0.0.0.0 --port 3012

i  hosting: Serving hosting files from: vite/out
✔  hosting: Local server: http://0.0.0.0:3012
...
```

Visit [http://localhost:3012](http://localhost:3012) and you should see a UI.

>Note: The UI uses a backend deployed to the cloud.
>
>If you haven't deployed the back end, yet, head to `../backend` sister package and follow its instructions.

><font color=red>BUG: currently broken!</font>

## Deploying

```
$ npm run deploy:vite
...
> deploy:vite
> firebase deploy --config firebase.vite.json --only hosting


=== Deploying to 'groundlevel-160221'...

i  deploying hosting
i  hosting[groundlevel-160221]: beginning deploy...
i  hosting[groundlevel-160221]: found 14 files in vite/out
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

[https://&lt;<i>your project id</i>&gt;.web.app](https://YOUR-PROJECT-ID.web.app)

---

<p align=right>Next: <a href="./README.ops.md">Ops monitoring</a></p>
