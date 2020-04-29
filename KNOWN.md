# Known Issues

## Warnings from Rollup plugins

When bringing in dependencies, you can spot:

```
$ npm install
...
npm WARN @rollup/plugin-replace@2.3.1 requires a peer of rollup@^1.20.0 but none is installed. You must install peer dependencies yourself.
```

Just ignore. The warning will seize once authors update `@rollup/plugin-replace` (other already did).

Rollup 2 seems to work as a plug-in replacement (from 1.31.1), so keeping it. 🙂

## Error: 

When running `npm run dev` (vite):

```
Error: Cannot find module 'vue-router/dist/vue-router.esm-bundler.js.map'
Require stack:
- /Users/asko/Git/GroundLevel-es6-firebase-web/noop.js
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:976:15)
    at resolveFileName (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/vite/node_modules/resolve-from/index.js:29:39)
    at resolveFrom (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/vite/node_modules/resolve-from/index.js:43:9)
    at Object.module.exports [as default] (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/vite/node_modules/resolve-from/index.js:46:47)
    at /Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/vite/dist/serverPluginModules.js:145:54
    at async /Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/vite/dist/serverPluginModules.js:34:9 {
  code: 'MODULE_NOT_FOUND',
  requireStack: [ '/Users/asko/Git/GroundLevel-es6-firebase-web/noop.js' ]
}
```

Is this just that `vue-router` doesn't have a source map, in its node package?  Can someone make it go away? 🧹  #advice #help

