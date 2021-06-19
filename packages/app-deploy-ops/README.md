# app-deploy-ops

Takes the app developed in `../app` sister package and prepares it for operations.

Adds:

- `@ops/central` implementation that connects the app's logging calls to a cloud service
- crash reporting
- Firebase production initialization (including baking in the access values)

We get the application logic as a module dependency, and don't expect anything from it (apart from it needing Firebase initialized and an implementation for `@ops/central`). It can use any web framework, and any libraries.

### Adapters

Available integrations:

||adapters|comments|
|---|---|---|
|Logging|[Cloud Logging](https://cloud.google.com/logging)|
|Crash reporting|tbd.|
|Performance monitoring|tbd.|

><font color=red>WARN: Adapters are still work-in-progress.</font>

You can tie logging to more than one logging adapter at any one time. This may be useful if evaluating vendors or transitioning between them.

### Use of Firebase CLI

For this sub-package, you need to log in to a Firebase project (instructions below).

This project can be a staging project - you should only deal with the production instance via CI/CD. This allows you eg. to develop the operational wrapping, but often even being in this sub-package is not necessary: CI/CD takes your backend and app, and changes here are presumed to be rather rare.


## Requirements

- npm

### Have the app built

```
$ (cd ../app && npm install && npm run build)
```

**!!** We don't set up a watch for the app folder. The latest build done there is picked up by `app-deploy-ops`. If you change app sources, also rebuild it.


## Getting started

Install dependencies:

```
$ npm install
```

Log into a Firebase (staging) project.

>This is needed even for building, since (for optimization) we bake the Firebase access values right into the artefact.

```
$ npx firebase login
...
$ npx firebase use --add
```

Pick a project you use for staging.

Build for deployment:

```
$ npm run build
...
created roll/out in 8.1s
```

<!-- skip (maybe move to later?)
### Analysing the build

After the command you have a ready-to-be-deployed web app under `roll/out`.

```
roll/out
├── adapters-f273c2ba.js
├── adapters-f273c2ba.js.map
├── app
│   ├── aside-keys-3fd8741c.js
│   ├── aside-keys-3fd8741c.js.map
│   ├── vue-01885567.js
│   ├── vue-01885567.js.map
│   ├── vue-router-5519ae70.js
│   └── vue-router-5519ae70.js.map
├── app.es-ed65462e.js
├── app.es-ed65462e.js.map
├── fatal.css
├── favicon.png -> ../../node_modules/@local/app/vitebox/public/favicon.png
├── firebase-5dc6e54f.js
├── firebase-5dc6e54f.js.map
├── firebase-auth-d6ea998a.js
├── firebase-auth-d6ea998a.js.map
├── firebase-firestore-90758cb6.js
├── firebase-firestore-90758cb6.js.map
├── firebase-performance-ce7d4c56.js
├── firebase-performance-ce7d4c56.js.map
├── index.html
├── main-3feb35cf.js
├── main-3feb35cf.js.map
├── ops-ea693b58.js
├── ops-ea693b58.js.map
├── style.css -> ../../node_modules/@local/app/vitebox/dist/style.css
├── tslib-9956b3d6.js
├── tslib-9956b3d6.js.map
└── worker
    ├── proxy.worker-6f726de1.iife.js
    ├── proxy.worker-6f726de1.iife.js.map
    ├── proxy.worker-7e0f3ce5.js
    └── proxy.worker-7e0f3ce5.js.map
```

The exact details may vary. This partitioning of JavaScript to ES modules is called *chunking*. You can chunk in many ways. It's controlled in the file `manualChunks.js`.

Chunks are loaded in by `roll/out/index.html`:

```
    <link rel="modulepreload" href="main-3feb35cf.js">
    <link rel="prefetch" as="script" href="adapters-f273c2ba.js">
    <link rel="modulepreload" href="firebase-5dc6e54f.js">
    <link rel="prefetch" as="script" href="ops-ea693b58.js">
    <link rel="modulepreload" href="firebase-performance-ce7d4c56.js">
    <link rel="prefetch" as="script" href="app.es-ed65462e.js">
    <link rel="modulepreload" href="app/vue-01885567.js">
    <link rel="modulepreload" href="firebase-auth-d6ea998a.js">
    <link rel="modulepreload" href="firebase-firestore-90758cb6.js">
    <link rel="modulepreload" href="app/aside-keys-3fd8741c.js">
    <link rel="modulepreload" href="app/vue-router-5519ae70.js">
    <link rel="modulepreload" href="tslib-9956b3d6.js">
```

Notice how some of the files are `modulepreload`ed whereas others are just `prefetch`ed.

When the browser processes `index.html`, it can start *all* of these fetches at once. If the server is HTTP/2 capable (Firebase hosting is), you'll get *one delivery* for all of them.

These should optimize your web app's loading time. It's always worth to measure those, to be sure.

<_!-- tbd. make a reference to "/ops/" (or something else?) once we have sections on performance monitoring.
--_>

-->


### Try it out

```
$ npm run serve
...
i  hosting: Serving hosting files from: roll/out
✔  hosting: Local server: http://0.0.0.0:3012
...
```

Visit [http://localhost:3012](http://localhost:3012) and you should see a UI.

>Note: The UI uses a backend deployed to the cloud.
>
>If you haven't deployed the back end, yet, head to `../backend` sister package and (remember you are logged in to the Firebase project):
>
>```
>$ npm run ci:deploy
>```

*<font color=red>tbd. Doesn't work like that - update the instructions (maybe deploy from here?)</font>
*

### Watch mode

If you develop the integration part (code in `src/`), it may be useful to have the code automatically repackaged after changes.

```
$ npm run watch:roll
```

>Note: This might not have Hot Module Reload (as `app` development has). Just press Refresh on the browser.

<!-- hint: contributions on setting up HMR for Rollup are welcome :)
-->

### Stats

It's good to keep an eye on the packaging sizes.

There are many Rollup packages for this, and the choices done in this repo may *not* be the best.

We have:

- `rollup-plugin-analyzer` showing the output sizes on every build
- `rollup-plugin-visualizer` creates `roll/stats.html` showing the same info in a graphical manner

>💡: Please suggest your favourite plugins to the author; we can also think of stripping these completely away - it's a very personal thing and maybe best left for tools that visualize a directory already created (not needing to be part of the build setup).


## Deploying

This shows how one can manually deploy the site to cloud. Such commands will be called by CI/CD, when one eg. merges new stuff to `master` in version control.

```
$ npm run deploy
...

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


## Logging

The logging adapters are added in this stage.

This is a very organization specific (or personal, if you are a one-person organization) choice. The reasons to pick a logging system might be:

1. **You already have one.** 

	There's no choice - you are told which one to use and how to use it.

2. **Integrations**

	It's part of your larger ops framework and you know a certain logging provider fits in well (to have alerts etc. function).

3. **The user interface**

	Logs are analyzed by people. The speed, ease of use and familiarity of the user interface matters, greatly!
	
	Don't burden yourself with a clumsy logging provider. Switch them! Compete them! We give you the means for that.

### Adapters

The GroundLevel central logging is based on adapters, allowing you to ship logs to or **or multiple** providers. You can eg. ship them both to the company standard logging provider, and a secondary one that you prefer for manual analysis.

You can create adapters yourself, and even publish and share them with others as npm packages.

>**Current state**
>
>The [Cloud Logging](https://cloud.google.com/logging) adapter is intended to be the initial one, but it's **work in progress** since Cloud Logging does not provide a browser facing logging client.
>
>Another nice one could be [Datadog](https://www.datadoghq.com). 


## Final yards

Getting your application deployed is simply the beginning of your journey.

The author hopes that this repo helped you to get *there* fast. 😋 
But now what?

Have a look at the [`ops`](../../ops) folder in this repo. It has documentation about how one can build operational prowness on top of a running product.

Then... build features... test... deploy... monitor... 🔁

Be your bugs be simple 🐞 and users friendly.

