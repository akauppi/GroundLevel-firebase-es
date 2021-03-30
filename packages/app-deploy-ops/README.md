# app-deploy-ops

Takes the app developed in `../app` sister package and prepares it for operations.

Adds:

- `@ops/central` implementation that connects the app's logging calls to a cloud service
- crash reporting
- Firebase production initialization

We get the application logic as a module dependency, and don't expect anything from it (apart from it needing Firebase initialized and an implementation for `@ops/central`). It can use any web framework, and any libraries.

Available integrations:

||||
|---|---|---|
|Logging|[Cloud Logging](https://cloud.google.com/logging)|Status: work in progress 🚧🚧🚧|
|Crash reporting|Writes to the logs|

You can tie logging to more than one logging adapter at any one time. This may be useful if evaluating vendors or transitioning between them.


## Requirements

- npm
- `firebase-tools`


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
$ npm run build
...
created roll/out in 8.1s
```

After the command you have a ready-to-be-deployed web app under `roll/out`.


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
>If you haven't deployed the back end, yet, head to `../backend` sister package and follow its instructions.


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

