# Known Issues

*Place for informing of things that are not seen as bugs.*

## Firebase hosting: "Cannot remove headers"

```
$ npm run prod:rollup:serve
...
Error [ERR_HTTP_HEADERS_SENT]: Cannot remove headers after they are sent to the client
...
```

Described here:

- [https://github.com/firebase/firebase-tools/issues/2610](https://github.com/firebase/firebase-tools/issues/2610)


**Work-around**

Don't open the browser as `http://localhost:3012` but `http://localhost:3012/index.prod.html`. Also otherwise try to avoid situations where the redirecting would be needed.




<!-- Haven't seen recently. REMOVE AK 14-Sep-20
## Vite build fails

With Vite `1.0.0-rc.4`:

```
$ npx vite build
vite v1.0.0-rc.4
⠋ Building for production...
[vite] Build errored out.
Error: [vite]: Rollup failed to resolve import "%7B%7B%20m.photoURL%20%7D%7D" from "src/pages/Project/index.vue?vue&type=template&id=81f22f30&scoped=true".
This is most likely unintended because it can break your application at runtime.
If you do want to externalize this module explicitly add it to
`rollupInputOptions.external`
    at Object.onwarn (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/vite/dist/node/build/index.js:70:19)
    at Object.onwarn (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/rollup/dist/shared/rollup.js:19374:20)
    at ModuleLoader.handleResolveId (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/rollup/dist/shared/rollup.js:18249:26)
    at /Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/rollup/dist/shared/rollup.js:18239:22
    at async Promise.all (index 1)
    at async ModuleLoader.fetchStaticDependencies (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/rollup/dist/shared/rollup.js:18237:34)
    at async Promise.all (index 0)
    at async ModuleLoader.fetchModule (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/rollup/dist/shared/rollup.js:18214:9)
    at async Promise.all (index 1)
    at async ModuleLoader.fetchStaticDependencies (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/rollup/dist/shared/rollup.js:18237:34) {
  watchFiles: [
    '/Users/asko/Git/GroundLevel-es6-firebase-web/index.html',
    '/Users/asko/Git/GroundLevel-es6-firebase-web/src/init.vite.js',
    '/Users/asko/Git/GroundLevel-es6-firebase-web/__.js',
...
```

This is weird.

`m.photoURL` is from an `img` tag, not an import.
-->


