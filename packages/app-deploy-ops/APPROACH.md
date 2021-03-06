# Approach

## Pulling in App via npm

This is pretty awesome!

We treat the application build as a dependency (which it is), and curry on top our own ops code.

In a nutshell, this approach puts the **production build** responsibility on the "app" sub-package whereas the **ops instrumentation** responsibility remains with us. 👏

**Alternative**

Importing as ES sources. This would mean that we *at least* need to be aware of the web framework used in building the app, and provide right build plugins for it. Since the App side already does this, it would be a duplicated effort.

## Pulling in Firebase from app

In order to keep Firebase Performance Monitoring on this side (in "ops") and to not end up in version dance with app, the following setup has been made:

- "app" pulls in `firebase` proper
- our reference to `firebase` et.al. points directly to the "app"'s dependencies in the *file system level*

This is needed because "app" takes care of production builds. It would tree shake away eg. Firebase Performance Monitoring, but going past the exposed library, we get to those bits.

**Alternative**

Doing production initialization of Firebase in "app" side; including performance monitoring.

Also us depending on `firebase`; the exact same version as "app" is (we kind of do this now, but don't need to mention that version in `package.json`).


## Using Rollup vs. Vite

Vite is mainly a rapid development tool (HMR = Hot Module Reload). Why would we use it for just building the final stage?

Pre-fetches for one. When our `index.html` has this:

```
<script type="module">
  import '/init/main.js';
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

