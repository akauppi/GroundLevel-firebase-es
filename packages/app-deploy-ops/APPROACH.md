# Approach

## Baking in the Firebase access values - why?

Normally, Firebase hosting provides the access values at `/__/firebase/init.js[on]`.

This is true also for our project, but it takes one extra network round trip to fetch those, and we prefer to avoid it. This makes the web app start snappier.

Instead:

- you set up a staging project (creates `../../firebase.{staging}.js`)
- build scripts read the access values from there, and inject them into the build

Everyone's happy? 😊


## Pulling in App via npm

This is pretty awesome!

We treat the application build as a dependency (which it is), and curry on top our own ops code.

In a nutshell, this approach puts the **production build** responsibility on the "app" sub-package whereas the **ops instrumentation** responsibility remains with us.

**Alternative**

Importing as ES sources. This would mean that we *at least* need to be aware of the web framework used in building the app, and provide right build plugins for it. Since the App side already does this, it would be a duplicated effort.


<!-- disabled; to be re-enabled once we test with Vite (and select the winner)! 🥇
## Using Rollup vs. Vite

Vite is mainly a rapid development tool (HMR = Hot Module Reload). Why would we use it for just building the final stage?

Pre-fetches for one. When our `index.html` has this:

```
<script type="module">
  import '/src/main.js';
</script>
```

..Vite expands it to this (`public/index.html`):

```
  <script type="module" crossorigin src="/assets/index.65ee72bf.js"></script>
  <link rel="modulepreload" href="/assets/vite.d0d1ba23.js">
  <link rel="modulepreload" href="/assets/index.esm.bafcf996.js">
  <link rel="modulepreload" href="/assets/tslib.d012e74f.js">
  <link rel="modulepreload" href="/assets/firebase-misc.13a81d66.js">
  <link rel="modulepreload" href="/assets/tslib.es6.6591dcdb.js">
  <link rel="modulepreload" href="/assets/firebase-auth.1d914af5.js">
  <link rel="modulepreload" href="/assets/firebase-firestore.b74557a0.js">
  <link rel="modulepreload" href="/assets/firebase-functions.cd464059.js">
```

We can do the same in Rollup, but need to manually create the actual `index.html` from a template.

By using Rollup, we need to code something like the above ourselves (which isn't too much) but we get a leaner toolchain with less fluff.

Ideally, we do both, allowing us to compare the output sizes and ease of development.

>Edit: Did the Rollup side. Now Vite doesn't fully work.
-->

## Using Firebase Hosting for `npm run serve`

It would be easy to serve the compiled output with an npm native serving solution. Too easy.

By using `firebase serve` we not only showcase the front end / staging back-end functionality, but also test the correctness of the `firebase.json` that *will* be used by the deployment of the hosting. Without this, problems with it would only be seen after deployment.

This obviously complicates things a little, since we don't run Firebase CLI locally, but in the Docker container.


## Where to log?

This should be simple, but...

Firebase doesn't have a solution for central logging of web applications.

### Considered: Log Events

There is [Log Events](https://firebase.google.com/docs/analytics/events) (part of Analytics) that states:

> Events provide insight on what is happening in your app, such as user actions, system events, or errors.

That's great! Pretty much what I want. Except...

To use "Log Events" one needs to enable Google Analytics for the Firebase project. The author would rather not have that, for such a central (*pun*) step as logging is.

<!-- disabled (readability)
>Sideline: You can of course use Log Events if that suits your application. Bake it into your app in the `app` subpackage. Or create an ops adapter for it.
-->

### Cloud Logging

As an initial adapter, we support [Cloud Logging](https://cloud.google.com/logging/docs). This is where your Cloud Functions logs are going, anyhow. The product also passes the "ease and speed" test above, in the author's opinion.

For some reason, there is no direct web app -> Cloud Logging possibility (without possibly complex authentication dances?). This is why the Cloud Logging adapter batches and ships the logs to your Cloud Functions, which then pass them on to Cloud Logging - which makes them visible for you in the dashboard.

This is not ideal. It means we need to cater for offline mode, transmission failures and optimize for batch size. But heck, it seems it's the way to go. 

**References:**

- [Collecting browser console logs in Stackdriver](https://medium.com/google-cloud/collecting-browser-console-logs-in-stackdriver-fa388a90d32b) (blog, Dec 2019)

   *Stackdriver is the earlier name for Cloud Logging*


## `import.meta.env.{key}`

There are some values that need injecting into the sources, at build times.

- API keys in `.env.${ENV-staging}`
- hash of the `roll/out/worker/*.js` file(s)

This is done by `@rollup/plugin-replace` and `import.meta.env.{key}` keys. This approach was selected mainly for familiarity with how Vite does it (limited to `VITE_...` keys).

The proxy workers' build was split apart from the main build (in the `package.json` level) so that the hashes can be sniffed, at the beginning of the main build. This simplifies the build files a bit, and doesn't seem to carry big negatives.

**Alternatives considered:**

```
import SOME_API_KEY from `@injected`
```

This would work, but the syntax is specific to this repo and therefore would look alien to developers.

A temporary file would be created, as part of the build, and the `@injected` module id mapped to it by aliasing.

The author things this is *cooler* but less familiar. Maybe later - it would be a sturdier approach than `@rollup/plugin-replace`; it would catch naming misalignments in build stage.

<!--
Also `dotenv` was considered but turned away from. It's commonly used (Vite uses it), but doesn't present much added value to parsing the `.env` file ourselves.
-->

