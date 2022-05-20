# Developer notes

## Rollup vs. Vite

It seems Rollup is winning the "fight" of production building, but we're keeping Vite as an option (though not actively maintained), like a spare tire (though without air!!).

**Rollup**

- provides more control
- demands more detailed configuration

**Vite**

- we use it in the app build
- it can do production builds, but with out workers and what-not, setting such up is challenging

**Ideally**, it would be awesome to be able to build the production front-end with either one, leaving the choice to the project owner. They can then place the output they prefer in the `firebase.json` `hosting.public` and roll on!!

**Current state:**

Vite build is kept in a semi-crippled form. Not intentionally, just lack of resources.

- `npm run //build:vite`, to show it's not actively maintained
- common things placed in `vite-or-roll` (Vite uses Rollup underneath)
- likely not worth replicating worker builds with Vite - like: ever..?

<!-- Editor's note: "Never say never"
-->

**Size comparison (aged)**

In Mar 2021, we got to Vite vs. Rollup size comparisons (these likely are from different code bases, but there is no big sway one way or the other).

Vite 488kB vs. Rollup 496kB

>Those numbers are likely before Brotli compression. In Jul 2021, Rollup build (with Brotli) is 119.48KB. Vite is unknown.

>One day, let's decide to have them both up - or toss one permanently aside?


## Watch the terminal, with `npm run watch`

If you feel like your changes don't affect the browser, maybe the code does not compile.

Rollup (our setup) doesn't tell this in the browser, so keep an eye on the terminal where `npm run watch` was run.

`#help`: If you know how to make the browser tell compilation errors (like in.. Vite!), a PR is welcome!


## Analysing the build

<!-- moved from README -->

After the build you have a ready-to-be-deployed web app under `roll/out`.

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
