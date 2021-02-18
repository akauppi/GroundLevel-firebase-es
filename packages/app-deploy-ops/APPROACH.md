# Approach

## Pulling in App via npm

This is pretty awesome!

We treat the application build as a dependency (which it is), and curry on top our own ops code.

Vite helps here with its [Glob import](https://vitejs.dev/guide/features.html#glob-import) feature that allows us to import the entry point, even when the entry point changes names (eg. `index.2bce9348.js`).

>Note: Maybe we could fix the output name in build side; then glob import won't be needed?

In a nutshell, this approach puts the **production build** responsibility on the "app" sub-package whereas the **ops instrumentation** responsibility remains with us. 👏

**Alternative**

Importing as ES sources. This would mean that we *at least* need to be aware of the web framework used in building the app, and provide right Vite plugins for it. Since the App side already does this, it would be duplicated effort.

## Using Vite vs. Rollup

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
