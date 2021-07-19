# app-deploy

Takes the app developed in `../app` sister package and prepares it for operations.

Adds:

- `@ops/central` implementation that connects the app's logging calls to a cloud service
- crash reporting
- Firebase production initialization
  - bakes in Firebase access values

We get the application logic as a module dependency, and don't expect anything from it (apart from it needing Firebase initialized and an implementation for `@ops/central`). It can use any web framework, and any libraries.

### Adapters

Available integrations:

||adapters|comments|
|---|---|---|
|Performance monitoring|tbd.|
|Logging|[Cloud Logging](https://cloud.google.com/logging)|
|Crash reporting|tbd.|

><font color=red>WARN: Adapters are still work-in-progress.</font>

<p />

>Note: You can use more than one adapter of a specific kind at any one time. This may be useful if evaluating vendors or transitioning between them.

<!-- DELME?
### Relation to deployment

For this sub-package, you need to log in to a Firebase project (instructions below).

This project can be a staging project - you should only deal with the production instance via CI/CD. This allows you eg. to develop the operational wrapping, but often even being in this sub-package is not necessary: CI/CD takes your backend and app, and changes here are presumed to be rather rare.
-->


## Requirements

- npm

### Have the app built

```
$ (cd ../app && npm install && npm run build)
```

>⚠️ We don't set up a watch for the app folder. The latest build done there is picked up by `app-deploy`. If you change app sources, also rebuild it.

### Have staging prepared

See [Deployment to staging](../../README.md#deployment-to-staging) in the main `README.md`.

<!-- Editor's note:
The link above should work in GitHub; it doesn't work with the MacDown editor
-->

This means there's a `../../firebase.staging.js` file that contains the means to reach the backend:

```
const config = {
  "projectId": "testing-123",
  "appId": "...",
  "locationId": "...",
  "apiKey": "...",
  "authDomain": "testing-123.firebaseapp.com",
};
export default config;
```

<!-- remove???
### Provide `.env.{staging|...}.js`

The access values (Firebase configuration) get *baked into the front-end code* and therefore need to be known for the build step, for two reasons:

- removes one critical request on first load (makes the app score better on LightHouse)
- allows deployment to hosting providers other than Firebase (though this is likely not necessary)

Provide the target deployment's access values in `.env.{default|...}.js` in this form:

```
const config = {
  "projectId": "testing-123",
  "appId": "...",
  "locationId": "...",
  "apiKey": "...",
  "authDomain": "testing-123.firebaseapp.com",
};
export default config;
```

To work with multiple targets, have multiple such files (`.env.staging.js`, `.env.prod.js`) and set the `ENV` env.var. to define the target.

You may consider adding the configurations you use to version control (they are not secrets).
-->

## Getting started

Install dependencies:

```
$ npm install
```

Build for deployment:

```
$ ENV=[production|staging|...] npm run build
...
created roll/out in 8.1s
```

### Try it out

```
$ npm run serve
...
i  hosting: Serving hosting files from: roll/out
✔  hosting: Local server: http://0.0.0.0:3012
...
```

Visit [http://localhost:3012](http://localhost:3012) and you should see a UI.


## Deploying

<font color=red>*Deployment is in a bit of flux, right now. We're moving towards CI/CD guidance and away from needing to be logged into the Firebase CLI tool (or even have it!).*

*You can use the below documentation, but need to first:*

```
$ npm install -g firebase-tools
$ firebase auth login
$ firebase use --add
```

*Hope that helps, for now.*
</font>

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


## Development (optional)

This section is about 

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


## Final yards

Getting your application deployed is simply the beginning of your journey.

The author hopes that this repo helped you to get *there* fast. 😋 
But now what?

Have a look at the [ops](../../ops) folder. It has documentation about how one can build operational prowness on top of a running product.

<!-- tbd. ops is unfinished, but... didn't find better wording. :S -->

Then... build features... test... deploy... monitor... 🔁

Be your bugs be simple 🐞 and users friendly.
